import { Request, Response } from 'express';
import { Chat } from './chats.model';
import { Message } from './chats.model';
import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../utils/errorHandler';
import { User } from '../@USER_ENTITY/user.model';
import catchAsyncError from '../../utils/catchAsyncError';
import { createNotification, URLType } from '../../utils/notification';

export const createChat = async (req: any, res: Response) => {
    const { userId2 } = req.body;
    const { userId } = req

    const isChat = await Chat.findOne({
        where: {
            [Op.or]: [{ userId1: userId, userId2: userId2 }, { userId1: userId2, userId2: userId }]
        }
    })

    if (!isChat) {
        const chat = await Chat.create({ userId1: userId, userId2 });
        return res.status(StatusCodes.CREATED).json({ success: true, chat })
    }
    res.status(201).json({ success: true, data: isChat });
};

export const getChats = async (req: any, res: Response, next: any) => {
    try {
        const { userId } = req; // Assuming user ID is attached to req.user by your middleware

        // Fetch all chats where the user is either user1 or user2
        const chats = await Chat.findAll({
            where: {
                [Op.or]: [{ userId1: userId }, { userId2: userId }],
            },
            include: [
                {
                    model: User,
                    as: 'user1',
                    attributes: ['id', 'name', 'email', 'avatar'],
                },
                {
                    model: User,
                    as: 'user2',
                    attributes: ['id', 'name', 'email', 'avatar'],
                },
                {
                    model: Message,
                    as: 'messages',
                    attributes: ['id', 'content', 'senderId', 'createdAt', 'readStatus'],
                    order: [['createdAt', 'DESC']],
                    limit: 1, // Fetch only the last message
                },
            ],
            order: [['updatedAt', 'DESC']],
        });

        if (!chats.length) {
            return res.status(StatusCodes.OK).json({ success: true, chats: [] });
        }

        const formattedChats = await Promise.all(chats.map(async (chat) => {
            // Determine the chat partner's user object based on the current user
            const chatPartner = chat.userId1 === userId ? chat.user2 : chat.user1;
            console.log(chatPartner)
            // Get the last message if it exists
            const lastMessage = chat.messages.length ? chat.messages[0] : null;

            // Count unread messages
            const unreadCount = await Message.count({
                where: {
                    chatId: chat.id,
                    receiverId: userId,
                    readStatus: false,
                },
            });

            return {
                chatId: chat.id,
                chatPartner: {
                    id: chatPartner.id,
                    name: chatPartner.name,
                    email: chatPartner.email,
                    avatar: chatPartner.avatar,
                },
                lastMessage: lastMessage ? {
                    id: lastMessage.id,
                    content: lastMessage.content,
                    senderId: lastMessage.senderId,
                    createdAt: lastMessage.createdAt,
                } : {
                    id: null,
                    content: null,
                    senderId: null,
                    createdAt: null
                },
                unreadCount,
            };
        }));

        res.status(StatusCodes.OK).json({ success: true, chats: formattedChats, userId });
    } catch (error) {
        console.error('Error fetching chats:', error);
        return next(new ErrorHandler('Failed to fetch chats', StatusCodes.INTERNAL_SERVER_ERROR));
    }
};

export const readAllMessages = catchAsyncError(async (req: any, res: any, next: any) => {
    const { chatId } = req.body
    const { userId } = req

    if (!chatId)
        return next(new ErrorHandler("Chat Id is required", StatusCodes.BAD_REQUEST))

    try {
        await Message.update(
            { readStatus: true },
            { where: { chatId: chatId, receiverId: userId, readStatus: false } }
        )
        res.status(StatusCodes.OK).json({ success: true, message: 'All messages marked as read' });
    } catch (error) {
        return next(new ErrorHandler("Failed to read messages", StatusCodes.INTERNAL_SERVER_ERROR))
    }
})

export const sendMessage = catchAsyncError(async (req: Request, res: Response) => {
    const { content, chatId, senderId, receiverId } = req.body;

    const message = await Message.create({ content, chatId, senderId, receiverId });
    const sender = await User.findByPk(senderId)
    await createNotification(
        receiverId,
        "Nearby Listing",
        `New message from ${sender?.name}`,
        sender?.avatar,
        URLType.CHAT
    );
    res.status(201).json({ success: true, data: message });
});

export const getMessages = async (req: Request, res: Response) => {
    const { chatId } = req.params;

    const messages = await Message.findAll({ where: { chatId }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ success: true, data: messages });
};
