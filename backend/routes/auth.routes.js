import express from "express";
import { adminRegister, approveRequest, getMe, getPendingRequests, logIn, logout, rejectRequest, requestAccess, resetPassword, sendOtp, verifyOtp, updateMe } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const authRouter = express.Router();

authRouter.post('/login', logIn);
authRouter.post('/register-admin', adminRegister);
authRouter.post('/request-access', requestAccess);
authRouter.get('/me', authMiddleware, getMe);
authRouter.put('/update-profile', authMiddleware, updateMe);
authRouter.get('/logout', authMiddleware, logout);

authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword);

// Admin Routes (Protected)
authRouter.get('/pending-requests', authMiddleware, authorize(['admin', 'root']), getPendingRequests);
authRouter.post('/approve/:id', authMiddleware, authorize(['admin', 'root']), approveRequest);
authRouter.post('/reject/:id', authMiddleware, authorize(['admin', 'root']), rejectRequest);

export default authRouter;