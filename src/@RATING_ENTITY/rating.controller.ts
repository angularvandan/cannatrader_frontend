import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../utils/errorHandler';
import catchAsyncError from '../../utils/catchAsyncError';
import Product from '../@PRODUCT_ENTITY/product.model';
import ProductRating from './rating.model';

export const rateProduct = catchAsyncError(async (req: any, res: any, next: any) => {
    const { productId } = req.params; // Product ID from URL
    const { rating } = req.body; // Rating from request body
    const { userId } = req; // Assume userId is obtained from the request

    if (!rating || rating < 1 || rating > 5) {
        return next(new ErrorHandler("Rating must be between 1 and 5", StatusCodes.BAD_REQUEST));
    }

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    // Check if the user has already rated this product
    const existingRating = await ProductRating.findOne({
        where: { productId, userId }
    });

    if (existingRating) {
        // Update existing rating
        await existingRating.update({ rating });
    } else {
        // Create new rating
        await ProductRating.create({ productId, userId, rating });
    }

    // Recalculate the average rating
    const ratings = await ProductRating.findAll({
        where: { productId }
    });

    const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;

    // Update product's average rating
    await product.update({ rating: averageRating });

    res.status(StatusCodes.OK).json({ success: true, message: "Rating submitted successfully" });
});
