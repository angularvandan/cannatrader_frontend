import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catchAsyncError";
import { Category, DryMethod, GrowMedia, GrowthMethod, StrainType, SubCategory, THC, TrimMethod } from "../@CATEGORY_ENTITY/category.model";
import Company from "../@COMPANY_ENTITY/company.model";
import Product from "../@PRODUCT_ENTITY/product.model";
import { User } from "../@USER_ENTITY/user.model";
import ErrorHandler from "../../utils/errorHandler";
import Wishlist from "../@WISHLIST_ENTITY/wishlist.model";
import ProductRating from "../@RATING_ENTITY/rating.model";
import Subscription from "../@SUBSCRIBE_ENTITY/subscribe.model";
import { s3UploadMulti, s3Uploadv2 } from "../../utils/s3";
import { Chat, Message } from "../@CHATS_ENTITY/chats.model";
import { Op } from "sequelize";
import { Notification } from "../@NOTIFICATION_ENTITY/notification.model";

export const dashboardData = catchAsyncError(async (req: any, res: any, next: any) => {
    const users = await User.count();
    const company = await Company.count();
    const product = await Product.count();
    const categories = await Category.count();
    const subCategories = await SubCategory.count();
    const strainType = await StrainType.count()
    const thc = await THC.count();
    const trim_method = await TrimMethod.count();
    const dry_method = await DryMethod.count();
    const grow_media = await GrowMedia.count();
    const growth_method = await GrowthMethod.count()

    res.status(StatusCodes.OK).json({
        success: true,
        users,
        company,
        product,
        categories,
        subCategories,
        strainType,
        thc,
        trim_method,
        dry_method,
        grow_media,
        growth_method,
    })
})

export const deleteUser = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params

    const user = await User.findByPk(id)
    if (!user)
        return next(new ErrorHandler("User not found!", StatusCodes.NOT_FOUND))
    await Wishlist.destroy({ where: { userId: id } })
    await Company.destroy({ where: { userId: id } })
    await ProductRating.destroy({ where: { userId: id } })
    await Product.destroy({ where: { user_id: id } })
    await Message.destroy({ where: { [Op.or]: [{ senderId: id }, { receiverId: id }] } })
    await Chat.destroy({ where: { [Op.or]: [{ userId1: id }, { userId2: id }] } })
    await Notification.destroy({ where: { userId: id } })
    await User.destroy({ where: { id: id } })

    res.status(StatusCodes.ACCEPTED).json({ success: true, message: "User deleted successfully" })
})

export const deleteProduct = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params

    if (!id)
        return next(new ErrorHandler("Id is required", StatusCodes.BAD_REQUEST))

    const product = await Product.findByPk(id)

    if (!product)
        return next(new ErrorHandler("Product not found!", StatusCodes.NOT_FOUND))

    await ProductRating.destroy({
        where: {
            productId: id
        }
    })

    await Wishlist.destroy({
        where: {
            productId: id
        }
    })
    await Product.destroy({
        where: {
            id: id
        }
    })

    res.status(StatusCodes.OK).json({ success: true, message: "Product Deleted Successfully!" })
})

export const getAllUsers = catchAsyncError(async (req: any, res: any, next: any) => {
    const users = await User.findAll({
        include: [
            { model: Company, as: "company" }
        ]
    })

    res.status(StatusCodes.OK).json({ success: true, users })
})

export const getSingleUser = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params
    const users = await User.findByPk(id, {
        include: [
            { model: Company, as: "company" }
        ]
    })

    res.status(StatusCodes.OK).json({ success: true, users })
})

export const getSingleCompany = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params
    const company = await Company.findByPk(id)

    if (!company)
        return next(new ErrorHandler("Company Not Found!", StatusCodes.NOT_FOUND))

    res.status(StatusCodes.OK).json({ success: true, company })
})

export const getAllCompany = catchAsyncError(async (req: any, res: any, next: any) => {
    const company = await Company.findAll()

    if (!company)
        return next(new ErrorHandler("Companies Not Found!", StatusCodes.NOT_FOUND))

    res.status(StatusCodes.OK).json({ success: true, company })
})

export const uploadImages = catchAsyncError(async (req: any, res: any, next: any) => {
    const images = req.files?.['images'];

    if (!images) {
        return next(new ErrorHandler("Images are required", StatusCodes.BAD_REQUEST));
    }

    // Validate file types
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (const image of images) {
        if (!allowedImageTypes.includes(image.mimetype)) {
            return next(new ErrorHandler("Only image files are allowed (JPEG, PNG, GIF)", StatusCodes.BAD_REQUEST));
        }
    }

    try {
        const imageUrls = await s3UploadMulti(images.map((image: any) => ({
            originalname: image.originalname,
            buffer: image.buffer,
        })));

        const imageLinks = imageUrls.map((loc: any) => loc.Location);

        res.status(StatusCodes.CREATED).json({ success: true, imageLinks });
    } catch (error) {
        return next(new ErrorHandler("Failed to upload images", StatusCodes.INTERNAL_SERVER_ERROR));
    }
});

export const uploadPDF = catchAsyncError(async (req: any, res: any, next: any) => {
    const pdf = req.files?.['pdf']?.[0];

    if (!pdf) {
        return next(new ErrorHandler("PDF is required", StatusCodes.BAD_REQUEST));
    }

    // Validate file type
    if (pdf.mimetype !== 'application/pdf') {
        return next(new ErrorHandler("Only PDF files are allowed", StatusCodes.BAD_REQUEST));
    }

    try {
        const pdfUrl = await s3Uploadv2({
            originalname: pdf.originalname,
            buffer: pdf.buffer,
        });

        res.status(StatusCodes.CREATED).json({ success: true, pdfUrl: pdfUrl.Location });
    } catch (error) {
        return next(new ErrorHandler("Failed to upload PDF", StatusCodes.INTERNAL_SERVER_ERROR));
    }
});
