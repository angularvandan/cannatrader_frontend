import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catchAsyncError";
import Company from "../@COMPANY_ENTITY/company.model";
import { User } from "../@USER_ENTITY/user.model";
import Subscription from "./subscribe.model";
import { createNotification, URLType } from "../../utils/notification";

export const subscribe = catchAsyncError(async (req: any, res: any, next: any) => {
    const { companyId } = req.body;
    const { userId } = req

    try {
        // Check if user and company exist
        const user = await User.findByPk(userId);
        const company = await Company.findByPk(companyId);

        if (!user || !company) {
            return res.status(404).json({ message: 'User or company not found' });
        }

        // Check if the user is already subscribed to the company
        const existingSubscription = await Subscription.findOne({
            where: { userId, companyId },
        });

        if (existingSubscription) {
            return res.status(400).json({ message: 'Already subscribed' });
        }

        const vendor = await User.findByPk(company.userId)

        // Create a new subscription
        const subscription = await Subscription.create({ userId, companyId });
        await createNotification(
            userId,
            "Subscription Confirmation",
            `You have successfully subscribed to ${company?.company_name}`,
            vendor?.avatar,
            URLType.SUBS
        );

        return res.status(201).json({ success: true, message: "Subscribed Successfully!", subscription });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

export const unsubscribe = catchAsyncError(async (req: any, res: any, next: any) => {
    const { companyId } = req.body;
    const { userId } = req

    try {

        const user = await User.findByPk(userId);
        const company = await Company.findByPk(companyId);

        if (!user || !company) {
            return res.status(404).json({ message: 'User or company not found' });
        }
        // Find and delete the subscription
        const subscription = await Subscription.findOne({
            where: { userId, companyId },
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const vendor = await User.findByPk(company.userId)

        await subscription.destroy();

        await createNotification(
            userId,
            "Un-subscription Confirmation",
            `You have successfully unsubscribed from ${company?.company_name}`,
            vendor?.avatar,
            URLType.SUBS
        );

        return res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

export const getAllSubscribtions = catchAsyncError(async (req: any, res: any, next: any) => {
    const { userId } = req
    const { page = 1, limit = 10, } = req.query
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const { rows: subscribtions, count } = await Subscription.findAndCountAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: Company,
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "avatar"]
                    },
                ],
                attributes: ["id", "company_name"]
            }
        ],
        offset,
        limit: parseInt(limit as string),
    })

    if (!subscribtions) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "No Subscribtions" })
    }

    res.status(StatusCodes.OK).json({
        success: true, subscribtions, count,
        totalPages: Math.ceil(count / parseInt(limit as string))
    })
})