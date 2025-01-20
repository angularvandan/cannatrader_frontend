import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleware/error';
dotenv.config({ path: "./config/config.env" });
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.get("/", (req, res) => res.json({ message: "Server is running" }));

// Import your routers
import { userRouter, companyRouter, productRouter, wishlistRouter, categoryRouter, adminRouter, subscribeRouter, ratingRouter, chatRouter, contentRouter, notificationRouter, User } from './src/index';

app.use('/api/users', userRouter);
app.use('/api/company', companyRouter);
app.use('/api/product', productRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/category', categoryRouter);
app.use('/api/admin', adminRouter);
app.use('/api/subscribtion', subscribeRouter);
app.use('/api/rating', ratingRouter);
app.use('/api/chat', chatRouter);
app.use('/api/content', contentRouter);
app.use('/api/notifications', notificationRouter);

app.all("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandler);

export default app