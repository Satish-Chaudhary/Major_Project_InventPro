import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import connectDB from './config/db.js';

dotenv.config()
const app = express()

const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    connectDB();
    console.log(`Server is Listening on port ${port
        }`);
})

export default app;