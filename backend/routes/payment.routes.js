import express from 'express';
import { 
    createOrder,
    verifyPayment,
    razorpayWebhookHandler,
    getPaymentHistory,
    processRefund,
    getInvoice
} from '../controllers/payment.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const paymentRouter = express.Router();

// Create Razorpay order
paymentRouter.post('/create-order', authMiddleware, createOrder);

// Verify payment signature
paymentRouter.post('/verify', authMiddleware, verifyPayment);

// Razorpay webhook handler
paymentRouter.post('/webhook', razorpayWebhookHandler);

// Retrieve payment history
paymentRouter.get('/history', authMiddleware, getPaymentHistory);

// Process refunds
paymentRouter.post('/refund', authMiddleware, authorize(['admin', 'root', 'staff']), processRefund);

// Download invoice
paymentRouter.get('/invoice/:id', authMiddleware, getInvoice);

export default paymentRouter;
