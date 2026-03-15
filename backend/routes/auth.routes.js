import express from "express";
import { adminRegister, approveRequest, getMe, getPendingRequests, logIn, logout, rejectRequest, requestAccess, resetPassword, sendOtp, verifyOtp } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";

const authRouter = express.Router();

authRouter.post('/login', logIn);
authRouter.post('/register-admin', adminRegister);
authRouter.post('/request-access', requestAccess);
authRouter.get('/me', authMiddleware, getMe);
authRouter.get('/logout', logout);

authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword);

// Admin Routes
authRouter.get('/pending-requests', getPendingRequests);
authRouter.post('/approve/:id', approveRequest);
authRouter.post('/reject/:id', rejectRequest);

export default authRouter;