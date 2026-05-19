import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js'
import orderRoutes from './routes/order.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import settingRoutes from './routes/setting.routes.js';
import reportRoutes from './routes/report.routes.js';
import poRoutes from './routes/purchaseOrder.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import customerRoutes from './routes/customer.routes.js'
import salesOrderRoutes from './routes/salesOrder.routes.js'
import invoiceRoutes from './routes/invoice.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import backupRoutes from './routes/backup.routes.js'
import systemRoutes from './routes/system.routes.js'
import connectDB from './config/db.js';

import { app, server } from './socket/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const port = process.env.PORT || 5000;

// Security Middleware: Set HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: false // Allow loading images/uploads locally
}));

app.use(cors({
    origin: "https://major-project-invent-pro.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}))

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent payload DOS
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use((req, res, next) => {
    ['body', 'params', 'headers', 'query'].forEach((k) => {
        if (req[k]) {
            mongoSanitize.sanitize(req[k]);
        }
    });
    next();
});

// Serve static files from uploads directory securely
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/purchase-orders", poRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/system", systemRoutes);

server.listen(port, () => {
    connectDB();
    console.log(`Server is Listening on port ${port}`);
})

export default app;