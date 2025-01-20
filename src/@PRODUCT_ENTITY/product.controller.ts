import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catchAsyncError";
import Product from "./product.model";
import { s3UploadMulti, s3Uploadv2 } from "../../utils/s3";
import ErrorHandler from "../../utils/errorHandler";
import { Op, literal, where } from "sequelize"
import { User } from "../@USER_ENTITY/user.model";
import Company from "../@COMPANY_ENTITY/company.model";
import { calculateDistance } from "../../utils/calculateDistance";
import { Category, DryMethod, GrowMedia, GrowthMethod, StrainType, SubCategory, THC, TrimMethod } from "../@CATEGORY_ENTITY/category.model";
import Subscription from "../@SUBSCRIBE_ENTITY/subscribe.model";
import Wishlist from "../@WISHLIST_ENTITY/wishlist.model";
import ProductRating from "../@RATING_ENTITY/rating.model";
import { createNotification, URLType } from "../../utils/notification";

// Helper function to calculate distance in km
const haversineFormula = (latitude: number, longitude: number, distance: number) => {
    const earthRadius = 6371; // Radius of the Earth in km
    return where(
        literal(`ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, ${distance * 1000})`),
        true
    );
};

export const getProducts = catchAsyncError(async (req: any, res: any) => {
    const { page = 1, limit = 10, strain_type, category, sub_category, thc_range, latitude, longitude, distance = 5, userId } = req.query;

    console.log(req.query)
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const filters: any = {};

    if (strain_type) {
        filters.strain_type = strain_type;
    }

    if (category) {
        filters.category = category;
    }

    if (sub_category) {
        filters.sub_category = sub_category;
    }

    if (thc_range) {
        filters.thc_range = thc_range
    }

    let whereClause: any = {
        ...filters,
    };

    if (latitude && longitude) {
        whereClause = {
            ...whereClause,
            [Op.and]: [
                whereClause,
                haversineFormula(parseFloat(latitude as string), parseFloat(longitude as string), parseFloat(distance as string)),
            ],
        };
    }

    const wishlistItems = userId ? await Wishlist.findAll({
        where: { userId: userId, is_wishlisted: true },
        attributes: ['productId']
    }) : [];

    const wishlistProductIds = wishlistItems.map((item: any) => item.productId);

    const { rows: products, count } = await Product.findAndCountAll({
        where: whereClause,
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
            {
                model: GrowMedia,
                as: "grow_medias"
            },
            {
                model: GrowthMethod,
                as: "growth_methods"
            },
            {
                model: TrimMethod,
                as: "trim_methods"
            },
            {
                model: DryMethod,
                as: "dry_methods"
            },
        ],
        offset,
        limit: parseInt(limit as string),
    });

    const productsWithWishlistStatus = products.map((product: any) => ({
        ...product.toJSON(),
        isWishlisted: wishlistProductIds.includes(product.id),
        distance: calculateDistance(latitude, longitude, product.location.coordinates[1], product.location.coordinates[0])
    }));

    res.status(200).json({ success: true, products: productsWithWishlistStatus, count, totalPages: Math.ceil(count / parseInt(limit as string)) });
});

export const getSingleProduct = catchAsyncError(async (req: any, res: any, next: any) => {
    const { id } = req.params;
    const { lat, lng, userId } = req.body; // Assuming user's location is sent in the request body
    if (!lat || !lng) {
        return next(new ErrorHandler("Latitude and longitude are required", StatusCodes.BAD_REQUEST));
    }

    // Step 1: Fetch the product details
    const product = await Product.findByPk(id,
        {
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
                {
                    model: GrowMedia,
                    as: "grow_medias"
                },
                {
                    model: GrowthMethod,
                    as: "growth_methods"
                },
                {
                    model: TrimMethod,
                    as: "trim_methods"
                },
                {
                    model: DryMethod,
                    as: "dry_methods"
                },
            ]
        }
    );
    if (!product) {
        return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    console.log("pprroodduucctt", product.user_id)
    // Step 2: Fetch the vendor details
    const vendor = await User.findOne({
        where: { id: product.user_id },
        attributes: ['id', 'name', 'phone_no', 'email', 'avatar']
    });
    if (!vendor) {
        return next(new ErrorHandler("Vendor not found", StatusCodes.NOT_FOUND));
    }

    // Step 3: Fetch the company details
    const company = await Company.findOne({
        where: { userId: vendor.id },
    });
    if (!company) {
        return next(new ErrorHandler("Company not found", StatusCodes.NOT_FOUND));
    }

    // Step 4: Calculate distance from user's location to company's location
    const companyLocation = company.business_location;
    const distance = calculateDistance(lat, lng, companyLocation.coordinates[1], companyLocation.coordinates[0]);

    let isWishlisted = false;
    if (userId) {
        const wishlistItem = await Wishlist.findOne({
            where: { userId: userId, productId: id, is_wishlisted: true },
        });
        isWishlisted = !!wishlistItem;
    }

    let subscribed = false;
    let myRating = 0;
    if (userId) {
        const subscription = await Subscription.findOne({
            where: { userId, companyId: company.id }
        });
        subscribed = !!subscription;

        const rating = await ProductRating.findOne({
            where: { productId: id, userId: userId }
        })
        myRating = rating?.rating ?? 0
    }

    // Recalculate the average rating
    const ratings = await ProductRating.count({
        where: { productId: id }
    });

    // Step 5: Combine results
    const productWithDetails = {
        ...product.toJSON(),
        ratings,
        myRating,
        isWishlisted,
        vendor: {
            ...vendor.toJSON(),
            company: {
                ...company.toJSON(),
                distance,
                subscribed,
            }
        }
    };

    res.status(StatusCodes.OK).json({
        success: true,
        product: productWithDetails
    });
});

export const getMyProducts = catchAsyncError(async (req: any, res: any, next: any) => {
    const { userId } = req
    const { page = 1, limit = 10 } = req.query

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let { rows: products, count } = await Product.findAndCountAll({
        where: {
            user_id: userId
        },
        attributes: ["id", "name", "images", "sub_category", "strain_type", "thc_range", "created_at"],
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
            {
                model: GrowMedia,
                as: "grow_medias"
            },
            {
                model: GrowthMethod,
                as: "growth_methods"
            },
            {
                model: TrimMethod,
                as: "trim_methods"
            },
            {
                model: DryMethod,
                as: "dry_methods"
            },
        ],
        order: [['created_at', 'DESC']],
        offset,
        limit
    })

    if (!products)
        return next(new ErrorHandler("No Products found!", StatusCodes.NOT_FOUND));

    res.status(200).json({ success: true, products, count, totalPages: Math.ceil(count / parseInt(limit as string)) })
})

export const addProduct = catchAsyncError(async (req: any, res: any, next: any) => {
    console.log("add Product", req.body);

    const { userId, companyId, company_name } = req;

    const requiredFields = ['name', 'strain_type', 'thc_range', 'category', 'lineage', 'harvest_date', 'thc_total', 'cbd', 'terpene', 'available', 'grade', 'growth_method', 'grow_media', 'dry_method', 'trim_method', 'irradiated', 'bud_size', 'tops', 'mids', 'lowers', 'description'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return next(new ErrorHandler(`Field ${field} is required`, StatusCodes.BAD_REQUEST));
        }
    }

    const pdfFile = req.files?.['pdf']?.[0];
    const images = req.files?.['images'];

    if (!pdfFile) {
        return next(new ErrorHandler("COA Report is required", StatusCodes.BAD_REQUEST));
    }

    if (!req.body.latitude || !req.body.longitude) {
        return next(new ErrorHandler("Please turn on your location", StatusCodes.BAD_REQUEST));
    }

    const location = {
        type: 'Point' as const,
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] as [number, number],
    };

    if (!images)
        return next(new ErrorHandler("Images are required", StatusCodes.BAD_REQUEST));

    // Validate and get Category
    const category = await Category.findByPk(req.body.category);
    if (!category) {
        return next(new ErrorHandler("Category not found", StatusCodes.BAD_REQUEST));
    }

    // Validate and get SubCategory
    if (req.body.sub_category) {
        const subCategory = await SubCategory.findByPk(req.body.sub_category);
        if (!subCategory) {
            return next(new ErrorHandler("SubCategory not found", StatusCodes.BAD_REQUEST));
        }
    }

    const pdfUrl = await s3Uploadv2({
        originalname: pdfFile.originalname,
        buffer: pdfFile.buffer,
    });

    const imageUrls = await s3UploadMulti(images!.map((image: any) => ({
        originalname: image.originalname,
        buffer: image.buffer,
    })));

    const subscriptions = await Subscription.findAll({
        where: {
            companyId: companyId
        }
    })


    const product = await Product.create({
        user_id: userId,
        coa_document: pdfUrl.Location,
        images: imageUrls.map(result => result.Location),
        rating: 0, // Adjust as needed
        location: location,
        category: req.body.category_id, // Add category_id to the product
        sub_category: req.body.sub_category, // Add sub_category_id to the product
        ...req.body,
    });

    for (const subscription of subscriptions) {
        await createNotification(
            subscription.userId,
            "New Listing from Subscribed User",
            `${company_name} has just listed a new product: ${product.name}`,
            imageUrls[0].Location,
            URLType.PRODUCT
        );
    }
    res.status(StatusCodes.CREATED).json({ success: true, data: product });
});

export const editProduct = catchAsyncError(async (req: any, res: any, next: any) => {
    console.log("edit Product", req.body);

    const { userId } = req;
    const { id } = req.params; // Assuming productId is passed as a URL parameter

    if (!req.body) {
        return next(new ErrorHandler("All fields are required", StatusCodes.BAD_REQUEST));
    }

    // Fetch the existing product
    const product = await Product.findByPk(id);
    if (!product) {
        return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    // Validate and get Category
    if (req.body.category) {
        const category = await Category.findByPk(req.body.category);
        if (!category) {
            return next(new ErrorHandler("Category not found", StatusCodes.BAD_REQUEST));
        }
    }

    // Validate and get SubCategory
    if (req.body.sub_category) {
        const subCategory = await SubCategory.findByPk(req.body.sub_category);
        if (!subCategory) {
            return next(new ErrorHandler("SubCategory not found", StatusCodes.BAD_REQUEST));
        }
    }

    // Destructure imageUrls and pdfUrl from request body
    const { imageUrls, pdfUrl } = req.body;

    // Update product details
    const updatedProduct = await product.update({
        ...req.body,
        coa_document: pdfUrl || product.coa_document, // Use provided PDF URL or keep the existing one
        images: imageUrls || product.images,          // Use provided image URLs or keep the existing ones
        category: req.body.category || product.category,
        sub_category: req.body.sub_category || product.sub_category,
    });

    res.status(StatusCodes.OK).json({ success: true, data: updatedProduct });
});


export const deleteProduct = catchAsyncError(async (req: any, res: any, next: any) => {
    const { userId } = req
    const id = req.params.id

    const product = await Product.findByPk(id)

    if (!product)
        return next(new ErrorHandler("Product not found!", StatusCodes.NOT_FOUND))

    const authorized = await Product.findOne({
        where: {
            user_id: userId
        }
    })

    if (!authorized)
        return next(new ErrorHandler("You are not authorized to delete this Product", StatusCodes.UNAUTHORIZED))

    const deleted = await Product.destroy({
        where: {
            id
        }
    })

    if (deleted > 0) {
        res.status(StatusCodes.ACCEPTED).json({
            success: true,
            message: "Product deleted successfully!"
        })
    } else {
        return next(new ErrorHandler("There was some problem deleting the product!", StatusCodes.INTERNAL_SERVER_ERROR))
    }

})