import S3 from 'aws-sdk/clients/s3';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { MulterError } from 'multer';

interface UploadedFile {
    originalname: string;
    buffer: Buffer;
}

export interface MulterRequest extends Request {
    files?: {
        image?: Express.Multer.File[];
        pdf?: Express.Multer.File[];
    };
}


export const s3Uploadv2 = async (file: UploadedFile) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_BUCKET_REGION,
    });

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `uploads/${Date.now().toString()}-${file.originalname}`,
        Body: file.buffer,
    };

    return await s3.upload(param).promise();
};

export const s3UploadMulti = async (files: UploadedFile[]) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_BUCKET_REGION,
    });

    const params = files.map((file) => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `uploads/${Date.now().toString()}-${file.originalname}`,
            Body: file.buffer,
        };
    });

    return await Promise.all(params.map((param) => s3.upload(param).promise()));
};


const storage = multer.memoryStorage();

const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.split("/")[0] === "image" || file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 6 },
});