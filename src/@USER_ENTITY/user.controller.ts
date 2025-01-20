import { Request, Response, NextFunction } from 'express';
import { Otp, User, UserType } from './user.model';
import catchAsyncError from '../../utils/catchAsyncError';
import sendEmail from '../../utils/sendEmail';
import generateOTP from '../../utils/otpGenerator';
import { s3Uploadv2, MulterRequest } from '../../utils/s3';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../../utils/errorHandler';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import { AuthRequest } from '../../middleware/auth';
import Product from '../@PRODUCT_ENTITY/product.model';
import Wishlist from '../@WISHLIST_ENTITY/wishlist.model';
import Company from '../@COMPANY_ENTITY/company.model';
import ProductRating from '../@RATING_ENTITY/rating.model';
import { createNotification, URLType } from '../../utils/notification'
import { Chat, Message } from '../@CHATS_ENTITY/chats.model';
import { Op } from 'sequelize';
import { Notification } from '../@NOTIFICATION_ENTITY/notification.model';
// Get message with OTP
const getMsg = (otp: string | number): string => {
  return `<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to my Cannatrader</h1>
        <p>Your verification OTP is</p><b>${otp}</b>
      </div>
    </body>
    </html>`;
};

// Interface for storing OTP parameters
interface StoreOtpParams {
  otp: number;
  userId: string;
}

// Function to store OTP
const storeOTP = async ({ otp, userId }: StoreOtpParams): Promise<void> => {
  console.log({ otp, userId });

  const otpInstance = await Otp.findOne({ where: { userId } });
  if (!otpInstance) {
    await Otp.create({
      otp,
      userId,
    });
  } else {
    otpInstance.otp = otp;
    await otpInstance.save();
  }
};

// Register user function
export const register = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  console.log("register", req.body);
  const { email, dob, name, phone_no, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser && existingUser.is_verified) {
    return next(new ErrorHandler("Email already in use", StatusCodes.BAD_REQUEST));
  }

  const userObj = {
    email,
    name,
    phone_no,
    password,
    role: UserType.USER,
  };

  let user;
  if (existingUser && !existingUser.is_verified) {
    await User.update(userObj, {
      where: {
        id: existingUser.id,
        email,
      },
    });
    user = await User.findOne({ where: { id: existingUser.id } });
  } else {
    user = await User.create(userObj);
  }

  const otp = generateOTP();
  await storeOTP({ otp, userId: user!.id });

  try {
    const message = getMsg(otp);
    await sendEmail({
      email: user!.email,
      subject: "Verify Registration OTP",
      message,
    });
    res.status(201).json({ message: "OTP sent to your email successfully" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const verifyRegOtp = catchAsyncError(async (req, res, next) => {
  console.log("verifyRegisterOTP", req.body);
  const { otp, email } = req.body;
  if (!otp || !email) {
    return next(new ErrorHandler("Missing OTP or email", 400));
  }
  const user = await User.findOne({ where: { email } });
  console.log({ user });
  if (!user)
    return next(
      new ErrorHandler("User not found please check entered email", 404)
    );

  const otpInstance = await Otp.findOne({ where: { otp } });
  if (!otpInstance || !otpInstance.isValid(otp)) {
    if (otpInstance) {
      await Otp.destroy({ where: { id: otpInstance.id } });
      await User.destroy({ where: { email } });
    }
    return next(new ErrorHandler("OTP is invalid or has been expired.", 400));
  }
  user.is_verified = true;
  await user.save();
  await Otp.destroy({ where: { id: otpInstance.id } });

  // await sendData(user, 201, res);
  const token = await user.getJWTToken();
  res.status(200).json({ success: true, user, token });
})

export const resendOTP = catchAsyncError(async (req, res, next) => {
  console.log("resendOTP", req.body);
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please enter your email.", 400));
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(
      new ErrorHandler("Please register or User doesn't exist.", 400)
    );
  }

  const otp = generateOTP();
  await storeOTP({ otp, userId: user.id });

  try {
    const message = getMsg(otp);
    await sendEmail({
      email: email,
      subject: "Resend OTP",
      message,
    });

    res.status(200).json({ message: "OTP sent to your email successfully" });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const forgotPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body

  if (!email) {
    return next(new ErrorHandler("Please provide a valid Email", StatusCodes.BAD_REQUEST));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(new ErrorHandler("User not found with entered credentials", StatusCodes.NOT_FOUND));
  }

  const otp = generateOTP();

  await storeOTP({ otp, userId: user.id });

  const message = `<b>Your password reset OTP is :- <h2>${otp}</h2></b><div>If you have not requested this email then, please ignore it.</div>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error: any) {
    await Otp.destroy({ where: { otp, userId: user.id } });
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }

})

export const verifyOTP = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new ErrorHandler("Missing OTP", StatusCodes.BAD_REQUEST));
  }

  const otpInstance = await Otp.findOne({ where: { otp } });

  if (!otpInstance) {
    return next(
      new ErrorHandler(
        "Invalid OTP. Please check the entered OTP.",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const otpDuration = await otpInstance.isValid(otp);

  // Check OTP validity and expiration
  if (!otpDuration) {
    // OTP found but expired
    await Otp.destroy({ where: { id: otpInstance.id } });
    return next(
      new ErrorHandler("OTP has been expired.", StatusCodes.BAD_REQUEST)
    );
  }

  await Otp.destroy({ where: { id: otpInstance.id } });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "OTP verified successfully", userId: otpInstance.userId });
});

export const changePassword = catchAsyncError(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId || req.body.userId;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("All fields are required", StatusCodes.BAD_REQUEST));
  }

  if (oldPassword === newPassword)
    return next(new ErrorHandler("Old Password cannot be same as New Password", StatusCodes.BAD_REQUEST))

  const user = await User
    .scope("withPassword")
    .findOne({ where: { id: userId } });

  if (!user) {
    return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
  }

  const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", StatusCodes.UNAUTHORIZED));
  }

  user.password = newPassword
  await user.save();

  //Notify User
  await createNotification(
    userId,
    "Account Activity",
    "Your password was successfully changed.",
    user.avatar,
    URLType.PROFILE
  );

  // Exclude password from the user object before sending the response
  const { password, ...userWithoutPassword } = user.toJSON();

  res.status(StatusCodes.OK).json({ success: true, message: "Password updated successfully", userWithoutPassword });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { userId, newPassword, confirmPassword } = req.body

  console.log(req.body)
  if (!newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please enter new password details", StatusCodes.BAD_REQUEST));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password and Confirm Password must be same", StatusCodes.BAD_REQUEST));
  }

  const user = await User
    .scope("withPassword")
    .findOne({ where: { id: userId } });

  if (!user) {
    return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
  }

  // Update the user's password
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ success: true, message: "Password reset successfully" });
})

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log("Login", req.body)
  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", StatusCodes.BAD_REQUEST));
  }
  // Find the user by email
  const user = await User.scope('withPassword').findOne({ where: { email } });

  console.log("USer", user)
  if (!user) {
    return next(new ErrorHandler("Email not Registered", StatusCodes.UNAUTHORIZED));
  }

  if (!user?.is_verified) {
    return next(new ErrorHandler("Verify OTP.", 403));
  }

  if (!user.is_active) {
    return next(new ErrorHandler("Account temporarily blocked!", StatusCodes.UNAUTHORIZED));
  }

  // Check if password matches
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", StatusCodes.UNAUTHORIZED));
  }

  // Generate JWT token
  const token = await user.getJWTToken();

  // Exclude password from the user object before sending the response
  const userWithoutPassword = user.toJSON();

  res.status(StatusCodes.OK).json({ success: true, user: userWithoutPassword, token });
});

export const getProfile = catchAsyncError(async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("User profile", req.userId);

  const { userId } = req;

  const user = await User.findByPk(userId, {
    attributes: [
      "id",
      "name",
      "email",
      "phone_no",
      "avatar",
      "role",
      "is_company",
      "is_verified"
    ], // Exclude 'role' attribute
  });

  if (!user)
    return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

  res.status(StatusCodes.OK).json({ success: true, user });
});

export const updateProfile = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  const { userId } = req;
  console.log("Req Body", req.body);
  const imageFile = req.files?.avatar?.[0];  // Handle avatar upload
  const healthLicenseFile = req.files?.pdf?.[0];  // Handle health license upload
  if (imageFile) {
    const imageUrl = await s3Uploadv2(imageFile);
    req.body.avatar = imageUrl.Location;
  }

  if (healthLicenseFile) {
    const healthLicenseUrl = await s3Uploadv2(healthLicenseFile);
    req.body.health_license = healthLicenseUrl.Location;
  }

  const updateData = User.getUpdateFields(req.body);

  console.log(updateData);
  if (Object.keys(updateData).length === 0) {
    return next(
      new ErrorHandler("Please provide data to update", StatusCodes.BAD_REQUEST)
    );
  }
  console.log(updateData);
  const [isUpdated] = await User.update(updateData, {
    where: { id: userId },
  });

  console.log("isUpdated", isUpdated);

  if (isUpdated === 0) {
    return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
  }

  const user = await User.findByPk(userId)

  await createNotification(
    userId,
    "Account Activity",
    "Your profile was updated successfully.",
    user?.avatar,
    URLType.PROFILE
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Profile Updated Successfully",
    isUpdated,
  });
});

export const deleteUser = catchAsyncError(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { userId } = req;

  await Wishlist.destroy({ where: { userId: userId } })
  await Company.destroy({ where: { userId: userId } })
  await ProductRating.destroy({ where: { userId: userId } })
  await Product.destroy({ where: { user_id: userId } })
  await Message.destroy({ where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] } })
  await Chat.destroy({ where: { [Op.or]: [{ userId1: userId }, { userId2: userId }] } })
  await Notification.destroy({ where: { userId: userId } })
  await User.destroy({ where: { id: userId }, force: true });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "User deleted successfully" });
});

// Get users function
export const getUsers = catchAsyncError(async (req: Request, res: Response) => {
  const users = await User.findAll({});
  res.status(StatusCodes.OK).json(users);
});

export const activateDeactivateUser = catchAsyncError(async (req: any, res: any, next: any) => {
  const { id } = req.params
  const user = await User.findByPk(id)
  if (user) {
    user.is_active = !user?.is_active
  }
  await user?.save()
  return res.status(StatusCodes.ACCEPTED).json({ message: 'User status updated successfully!' });
})