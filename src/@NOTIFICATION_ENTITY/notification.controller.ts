import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catchAsyncError";
import { Notification } from "./notification.model";
import ErrorHandler from "../../utils/errorHandler";

export const getNotifications = catchAsyncError(async (req: any, res: any, next: any) => {
    const { userId } = req

    const notifications = await Notification.findAll({
        where: {
            userId: userId
        },
        order: [['createdAt', 'DESC']]
    })

    const unReadCount = await Notification.count({
        where: {
            allRead: false
        }
    })

    res.status(StatusCodes.OK).json({ success: true, notifications, unReadCount })
})

export const markAllRead = catchAsyncError(async (req: any, res: any, next: any) => {
    const { userId } = req;

    try {
        await Notification.update(
            { allRead: true },
            { where: { userId, allRead: false } }
        );

        res.status(StatusCodes.OK).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        return next(new ErrorHandler('Failed to mark notifications as read', StatusCodes.INTERNAL_SERVER_ERROR));
    }
});

export const markSingleNotificationRead = catchAsyncError(async (req: any, res: any, next: any) => {
    const { userId } = req
    const { id } = req.query

    const notification = await Notification.findByPk(id)
    if (!notification) {
        return next(new ErrorHandler("Notification not found!", StatusCodes.NOT_FOUND))
    }

    try {
        await Notification.update(
            { isRead: true },
            { where: { id, isRead: false } }
        );
        res.status(StatusCodes.OK).json({ success: true, message: "Notification marked as read" })
    } catch (error) {
        return next(new ErrorHandler('Failed to mark notifications as read', StatusCodes.INTERNAL_SERVER_ERROR));
    }
});

export const deleteNotification = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params; // Notification ID from URL params

    try {
        const notification = await Notification.findByPk(id);

        if (!notification) {
            return next(new ErrorHandler('Notification not found', StatusCodes.NOT_FOUND));
        }

        await notification.destroy();

        res.status(StatusCodes.OK).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        return next(new ErrorHandler('Failed to delete notification', StatusCodes.INTERNAL_SERVER_ERROR));
    }
});