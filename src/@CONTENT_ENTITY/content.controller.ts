import { StatusCodes } from "http-status-codes";
import catchAsyncError from "../../utils/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { Content, Query } from "./content.model";
import sendEmail from "../../utils/sendEmail";

const TT = "TERMS_AND_CONDITIONS";
const PP = "PRIVACY_POLICY";

const getResponseMsg = (response: string): string => {
  return `<html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 10px;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            color: #555555;
          }
          .response {
            margin-top: 20px;
            padding: 10px;
            background-color: #e9f5e9;
            border-left: 4px solid #4CAF50;
            font-size: 18px;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            font-size: 14px;
            color: #888888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Your Query Response</h1>
          <p>Dear User,</p>
          <p>Thank you for reaching out to us. We have reviewed your query.</p>
          <div class="response">
            ${response}
          </div>
          <p>If you have any further questions or need additional assistance, please don't hesitate to get in touch with us.</p>
          <p>Best regards,<br>
          Cannatrader Support Team</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Cannatrader. All rights reserved.
          </div>
        </div>
      </body>
      </html>`;
};


export const createUpdateContent = catchAsyncError(async (req: any, res: any, next: any) => {
  console.log("create content", req.body);
  const { title, desc } = req.body;

  if (!title || !desc) {
    return next(new ErrorHandler("Title and description are required", 400));
  }

  let content = await Content.findOne({ where: { title } });

  if (!content) {
    // Create new content if it doesn't exist
    content = await Content.create(req.body);
    return res.status(201).json({ success: true, content });
  } else {
    // Update existing content
    const [affectedRows, updatedContent] = await Content.update(req.body, {
      where: { title },
      returning: true,
    });

    if (affectedRows === 0) {
      return next(new ErrorHandler("Failed to update content", 500));
    }

    return res.status(200).json({ success: true, content: updatedContent[0] });
  }
});

export const getContent = catchAsyncError(async (req, res, next) => {
  console.log("getContent");
  const { title } = req.query
  if (!title)
    return next(new ErrorHandler("Title is required", StatusCodes.BAD_REQUEST))
  const content = await Content.findOne({ where: { title: title } });
  res.status(200).json({ content });
});

export const deleteContent = catchAsyncError(async (req, res, next) => {
  const isDeleted = await Content.destroy({
    where: {
      title: req.query.type
    }
  })

  if (!isDeleted)
    return next(new ErrorHandler("Content Not Found", StatusCodes.NOT_FOUND))

  res
    .status(200)
    .json({ success: true, message: "Content deleted successfully" });
})

export const submitQuery = catchAsyncError(async (req, res, next) => {
  const requiredFields = ['name', 'email', 'phone_no', 'message'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return next(new ErrorHandler(`Field ${field} is required`, StatusCodes.BAD_REQUEST));
    }
  }

  const query = await Query.create(req.body)
  res.status(StatusCodes.CREATED).json({ success: true, message: "Query submitted successfully" })
})

export const getQuery = catchAsyncError(async (req, res, next) => {
  const query = await Query.findAll()
  res.status(StatusCodes.OK).json({ success: true, query })
})

export const respondToQuery = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { response } = req.body;

  const query = await Query.findByPk(id);

  if (!query) {
    return next(new ErrorHandler("Query not found", StatusCodes.NOT_FOUND));
  }

  query.response = response;

  try {
    // Send email notification to the user
    const message = getResponseMsg(response);

    await sendEmail({
      email: query.email,
      subject: "Your Cannatrader Query Response",
      message,
    });

    // If the email is successfully sent, update isNotified to true
    query.isNotified = true;
    await query.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Response sent successfully", query });
  } catch (error) {
    // Handle email sending errors
    console.error("Error sending email:", error);

    // Even if the email fails, save the response, but leave isNotified as false
    await query.save();

    return next(new ErrorHandler("Failed to send email, but response saved", StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

export const deleteQuery = catchAsyncError(async (req, res, next) => {
  const { id } = req.params

  const query = await Query.findByPk(id)
  if (!query)
    return next(new ErrorHandler("Query not Found!", StatusCodes.NOT_FOUND))

  const isDeleted = await Query.destroy({
    where: {
      id: id
    }
  })

  if (!isDeleted)
    return next(new ErrorHandler("Query Not Found!", StatusCodes.NOT_FOUND))

  res
    .status(200)
    .json({ success: true, message: "Query deleted successfully" });
})