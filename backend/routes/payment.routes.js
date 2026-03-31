import express from 'express';
import { 
    createPaymentIntent, 
    confirmPayment, 
    stripeWebhook, 
    razorpayWebhook 
} from '../controllers/payment.controllers.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const paymentRouter = express.Router();

// Intent creation (Protected)
paymentRouter.post('/create-intent', authMiddleware, authorize(['admin', 'root', 'staff', 'customer']), createPaymentIntent);

// Direct Confirmation (Protected)
paymentRouter.post('/confirm', authMiddleware, authorize(['admin', 'root', 'staff', 'customer']), confirmPayment);

// Webhooks (Public)
paymentRouter.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
paymentRouter.post('/webhook/razorpay', razorpayWebhook);

export default paymentRouter;
