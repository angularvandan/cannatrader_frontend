import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserType, UserAttributes } from '../src/@USER_ENTITY/user.model';
import ErrorHandler from '../utils/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { Company } from '../src';

export interface AuthRequest extends Request {
    userId?: string;
    user?: UserAttributes;
    companyId?: any;
    company_name?: any;
}

export const auth = async (req: any, res: Response, next: NextFunction) => {
    console.log(req.headers.authorization);
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({
                error: {
                    message: 'Unauthorized. Please send token in request header',
                },
            });
        }

        const token = req.headers.authorization
        console.log("tttttttooooooookkkkkkkkeeeeeeennnnnn", token)
        const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        console.log({ userId });

        const user = await User.findByPk(userId)
        if (!user?.is_active) {
            return next(new ErrorHandler("Account temporarily blocked!", StatusCodes.UNAUTHORIZED));
        }
        req.userId = userId;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({ error: { message: 'Unauthorized' } });
    }
};

export const authRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return next(new ErrorHandler('Unauthorized.', StatusCodes.UNAUTHORIZED));
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return next(new ErrorHandler('Invalid token. User not found.', StatusCodes.NOT_FOUND));
        }

        const company = await Company.findOne({ where: { userId } })
        // Check for vendor specific fields
        if (!company) {
            return next(new ErrorHandler('Please create Business Profile.', StatusCodes.UNAUTHORIZED));
        }

        req.user = user.get({ plain: true });
        req.companyId = company.id
        req.company_name = company.company_name
        next();
    } catch (error) {
        return next(new ErrorHandler('Unauthorized.', StatusCodes.UNAUTHORIZED));
    }
};

export const onlyAdmin = async (req: any, res: any, next: any) => {
    try {
        const { userId } = req;

        const user = await User.findByPk(userId);
        console.log(user);
        if (!user)
            return next(new ErrorHandler("Invalid token. User not found.", 404));

        console.log(user.role);
        if (user.role !== "admin") {
            return next(new ErrorHandler("Restricted.", 401));
        }

        next();
    } catch (error: any) {
        return next(new ErrorHandler(error, StatusCodes.INTERNAL_SERVER_ERROR));
    }
};