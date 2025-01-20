import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    console.log("inside sendEmail", { options });

    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: Number(process.env.SMPT_PORT),
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_EMAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.SMPT_EMAIL,
        to: options.email,
        subject: options.subject,
        html: options.message,
    });

    console.log({ id: info.messageId });
};

export default sendEmail;
