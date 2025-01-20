import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../../utils/errorHandler";
import Wishlist from "./wishlist.model";
import catchAsyncError from "../../utils/catchAsyncError";
import Product from "../@PRODUCT_ENTITY/product.model";
import { calculateDistance } from '../../utils/calculateDistance';
import { Category, StrainType, SubCategory, THC } from "../@CATEGORY_ENTITY/category.model";


export const addToWishlist = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const userId = req.userId;

    // Check if the product exists
    const product = await Product.findByPk(id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({
        where: { userId: userId, productId: id, is_wishlisted: true }
    });

    if (existingWishlistItem) {
        return next(new ErrorHandler('Product is already in wishlist', StatusCodes.FORBIDDEN));
    }

    // Add the product to the wishlist
    const wishlistItem = await Wishlist.create({
        userId: userId,
        productId: id,
        is_wishlisted: true
    });

    res.status(201).json({
        success: true,
        message: 'Product added to wishlist',
    });
});


export const removeFromWishlist = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;  // Product ID to be removed from wishlist
    const userId = req.userId;  // ID of the user who wants to remove the product from the wishlist

    // Check if the product exists in the wishlist for the user
    const existingWishlistItem = await Wishlist.findOne({
        where: { userId: userId, productId: id, is_wishlisted: true }
    });

    if (!existingWishlistItem) {
        return next(new ErrorHandler('Product not found in wishlist', StatusCodes.NOT_FOUND));
    }

    // Remove the product from the wishlist
    await Wishlist.destroy({
        where: { userId: userId, productId: id, is_wishlisted: true }
    });

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Product removed from wishlist',
    });
});


export const getWishlist = catchAsyncError(async (req: any, res: any, next: any) => {
    const userId = req.userId;
    const { lat, lng, page = 1, limit = 10, } = req.query; // Assuming user's location is sent in the request body
    console.log(req.query)
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    if (!lat || !lng) {
        return next(new ErrorHandler("Latitude and longitude are required", StatusCodes.BAD_REQUEST));
    }
    // Fetch the user's wishlist items
    const { rows: wishlistItems, count } = await Wishlist.findAndCountAll({
        where: { userId: userId, is_wishlisted: true },
        include: [
            {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'strain_type', 'thc_range', 'category', 'sub_category', 'images', 'location', 'created_at'],
                include: [
                    {
                        model: Category,
                        as: "categories"
                    },
                    {
                        model: SubCategory,
                        as: "subCategory"
                    },
                    {
                        model: THC,
                        as: "thc_ranges"
                    },
                    {
                        model: StrainType,
                        as: "strain_types"
                    },
                ]
            }
        ],
        offset,
        limit: parseInt(limit as string),
    });

    const wishlistWithDistances = wishlistItems.map((item: any) => {
        const product = item.product;
        console.log("Wishlisted", product)
        const distance = calculateDistance(lat, lng, product.location.coordinates[1], product.location.coordinates[0]);

        return {
            id: product.id,
            name: product.name,
            strain_type: {
                id: product.strain_type,
                type: product.strain_types?.type // Use the name of strain type
            },
            thc_range: {
                id: product.thc_range,
                range: product.thc_ranges?.range // Use the name of THC range
            },
            category: {
                id: product.category,
                name: product.categories?.name // Use the name of category
            },
            sub_category: {
                id: product.sub_category,
                name: product.subCategory?.name // Use the name of subcategory
            },
            created_at: product.created_at,
            images: product.images,
            distance
        };
    });

    res.status(200).json({
        success: true,
        wishlistItems: wishlistWithDistances,
        count,
        totalPages: Math.ceil(count / parseInt(limit as string))
    });
});
