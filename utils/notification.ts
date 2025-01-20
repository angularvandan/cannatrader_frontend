import { Notification } from "../src/@NOTIFICATION_ENTITY/notification.model"

async function createNotification(
    userId: any,
    title: string,
    message: string,
    image: any,
    redirectUrl: any,
) {
    try {
        const notification = await Notification.create({
            userId,
            title,
            message,
            image,
            redirectUrl,
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
    }
}

enum URLType {
    SUBS = 'Subscription',
    PROFILE = 'Profile',
    CHAT = 'Chat',
    PRODUCT = 'Product'
}
export { createNotification, URLType };