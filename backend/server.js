import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import connectDB from './config/db.js';
import cors from 'cors';

dotenv.config()
const app = express()

const port = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
    connectDB();
    console.log(`Server is Listening on port ${port
        }`);
})

export default app;