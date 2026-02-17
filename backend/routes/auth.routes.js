import express from "express";
import { logIn, logout, requestAccess, resetPassword, sendOtp, verifyOtp } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post('/login', logIn);
authRouter.post('/request-access', requestAccess);
authRouter.get('/logout', logout);

authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword);

export default authRouter;