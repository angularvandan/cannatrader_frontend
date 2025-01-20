import express from 'express';
import { createChat, getChats, sendMessage, getMessages, readAllMessages } from './chats.controller';
import { Message } from './chats.model';
import { User } from '../@USER_ENTITY/user.model';
import { Op, Sequelize } from 'sequelize';
import { auth } from '../../middleware/auth';

const router = express.Router();

router.post('/create', auth, createChat);
router.get('/', auth, getChats);
router.post('/message', auth, sendMessage);
router.get('/messages/:chatId', auth, getMessages);
router.post('/read-all-messages', auth, readAllMessages)
// router.get('/chatrooms/:userId', async (req, res) => {
//     const { userId } = req.params;
//     const chatRooms = await ChatRoom.findAll({
//         where: {
//             [Op.or]: [{ participant1Id: userId }, { participant2Id: userId }]
//         },
//         include: [{ model: User, as: 'participant1' }, { model: User, as: 'participant2' }]
//     });
//     res.json(chatRooms);
// });

// // Retrieve messages for a chat room
// router.get('/messages/:chatRoomId', async (req, res) => {
//     const { chatRoomId } = req.params;
//     const messages = await Message.findAll({
//         where: { chatRoomId },
//         include: [{ model: User }],
//         order: [['timestamp', 'ASC']],
//     });
//     res.json(messages);
// });

// // Send a new message
// router.post('/messages', async (req, res) => {
//     const { chatRoomId, senderId, content } = req.body;
//     const message = await Message.create({ chatRoomId, senderId, content });
//     res.json(message);
// });

export default router;
