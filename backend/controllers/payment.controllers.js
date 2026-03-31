import PaymentService from '../services/payment.service.js';
import SalesOrder from '../models/salesOrder.model.js';
import { sendNotification } from '../utils/notification.utils.js';

/**
 * Create a payment intent for an order
 * @route POST /api/payments/create-intent
 */
export const createPaymentIntent = async (req, res) => {
    try {
        const { orderId, gateway } = req.body;
        
        if (!orderId || !gateway) {
            return res.status(400).json({ 
                success: false, 
                message: 'Order ID and gateway are required' 
            });
        }

        const result = await PaymentService.createPaymentIntent(orderId, gateway);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Create Payment Intent Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating payment intent'
        });
    }
};

/**
 * Handle successful payment callback (Client-side confirmation)
 * @route POST /api/payments/confirm
 */
export const confirmPayment = async (req, res) => {
    try {
        const paymentData = req.body;
        
        const payment = await PaymentService.handleSuccessfulPayment(paymentData);
        
        res.status(200).json({
            success: true,
            message: 'Payment confirmed and order updated',
            data: payment
        });
    } catch (error) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error confirming payment'
        });
    }
};

/**
 * Stripe Webhook Handler
 * @route POST /api/payments/webhook/stripe
 */
export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Construct the event using the raw body and signature
        // Note: Stripe requires raw body for signature verification
        event = req.body; // In a real app, use stripe.webhooks.constructEvent
        
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;
            
            await PaymentService.handleSuccessfulPayment({
                orderId,
                transactionId: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                paymentMethod: 'card',
                gateway: 'stripe'
            });
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Stripe Webhook Error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

/**
 * Razorpay Webhook Handler
 * @route POST /api/payments/webhook/razorpay
 */
export const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        // In a real app, verify signature here
        
        const event = req.body;
        
        if (event.event === 'payment.captured') {
            const payload = event.payload.payment.entity;
            const orderId = payload.notes.orderId; // Assuming orderId is in notes
            
            await PaymentService.handleSuccessfulPayment({
                orderId,
                transactionId: payload.id,
                amount: payload.amount / 100,
                paymentMethod: payload.method,
                gateway: 'razorpay'
            });
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Razorpay Webhook Error:', error);
        res.status(400).send('Webhook Error');
    }
};
