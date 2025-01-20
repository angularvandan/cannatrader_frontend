import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import Company from "./company.model";
import { s3Uploadv2 } from "../../utils/s3";
import { User } from "../@USER_ENTITY/user.model";
import { NextFunction } from "express";

export const registerCompany = catchAsyncError(async (req: any, res: any, next) => {
  const { userId } = req
  const { company_name, business_type, contact_no, business_id_no, latitude, longitude } = req.body
  const pdf = req.files.pdf?.[0]

  const user = await User.findByPk(userId)
  console.log(user)

  if (!user)
    return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

  if (!company_name || !business_type || !contact_no || !business_id_no) {
    return next(new ErrorHandler("All Fields are required!", StatusCodes.BAD_REQUEST))
  }

  if (!pdf) {
    return next(new ErrorHandler("Health license is required", StatusCodes.BAD_REQUEST))
  }

  const pdfUrl = await s3Uploadv2({
    originalname: pdf.originalname,
    buffer: pdf.buffer,
  });

  if (!pdfUrl) {
    return next(new ErrorHandler("Failed to upload health license", StatusCodes.INTERNAL_SERVER_ERROR));
  }
  if (!latitude || !longitude) {
    return next(new ErrorHandler("Please turn on your location", 400));
  }


  const location = {
    type: 'Point' as const,
    coordinates: [parseFloat(longitude), parseFloat(latitude)] as [number, number],
  };

  const company = await Company.create({
    userId,
    company_name,
    business_type,
    contact_no,
    business_location: location,
    business_id_no,
    health_license: pdfUrl.Location,
  });

  await user.update({ is_company: true });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: company,
  });
})

export const getCompanyDetails = catchAsyncError(async (req: any, res: any, next) => {
  const { userId } = req;

  const user = await User.findByPk(userId)
  console.log(user)

  if (!user)
    return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

  const company = await Company.findOne({
    where: { userId }, include: [
      {
        model: User,
        as: 'user'
      }
    ]
  });

  if (!company) {
    return next(new ErrorHandler('Company Details not found', StatusCodes.NOT_FOUND));
  }

  // if (!user.company) {
  //   return next(new ErrorHandler('Company not found for this user', StatusCodes.NOT_FOUND));
  // }

  res.status(StatusCodes.OK).json({
    success: true,
    company
  });
});

export const updateBusiness = catchAsyncError(async (req: any, res: any, next: NextFunction) => {
  const { userId } = req;
  const { company_name, business_type, contact_no, business_id_no, latitude, longitude, pdf } = req.body;

  const user = await User.findByPk(userId);
  if (!user) return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));

  const company = await Company.findOne({ where: { userId } });
  if (!company) return next(new ErrorHandler("Company not found", StatusCodes.NOT_FOUND));

  const updates: any = {};

  if (company_name) updates.company_name = company_name;
  if (business_type) updates.business_type = business_type;
  if (contact_no) updates.contact_no = contact_no;
  if (business_id_no) updates.business_id_no = business_id_no;
  if (pdf) updates.health_license = pdf;
  if (latitude && longitude) {
    updates.business_location = {
      type: 'Point' as const,
      coordinates: [parseFloat(longitude), parseFloat(latitude)] as [number, number],
    };
  }

  await company.update(updates);

  res.status(StatusCodes.OK).json({
    success: true,
    data: company,
  });
});