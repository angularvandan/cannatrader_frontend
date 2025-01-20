import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../utils/errorHandler';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error({ err });
    err.message = err.message || "Internal Server Error";

    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            err = new ErrorHandler(
                "File size should not be more than 10MB",
                StatusCodes.REQUEST_TOO_LONG
            );
        }

        if (err.code === "LIMIT_FILE_COUNT") {
            err = new ErrorHandler("File limit reached", StatusCodes.BAD_REQUEST);
        }

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            err = new ErrorHandler(
                "You have exceeded the maximum number of allowed images (5).",
                StatusCodes.UNPROCESSABLE_ENTITY
            );
        }
    }

    if (err.name === "CastError") {
        const msg = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(msg, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (err.name === "SequelizeValidationError") {
        let errors = err.errors.map((el: any) => {
            let message = el.message;
            if (
                el.validatorKey === "notEmpty" ||
                el.validatorKey === "notNull" ||
                el.validatorKey === "is_null" ||
                el.validatorKey === "is_Email"

            ) {
                message = `${el.path} ${el.message}`;
            }
            return message;
        });

        const msg = errors.join(", ");
        err = new ErrorHandler(msg, StatusCodes.CONFLICT);
    }

    if (err.name === "SequelizeUniqueConstraintError") {
        let errors = err.errors.map((el: any) => {
            if (el.path === "email") {
                return "Email is already registered.";
            }
            return el.message;
        });

        err = new ErrorHandler(errors.join(", "), StatusCodes.CONFLICT);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid token, please try again`;
        err = new ErrorHandler(message, StatusCodes.UNAUTHORIZED);
    }

    if (err.name === "TokenExpiredError") {
        const message = `Token has expired, please login again`;
        err = new ErrorHandler(message, StatusCodes.UNAUTHORIZED);
    }

    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
            message: err.message,
        },
    });
};

export default errorHandler;
