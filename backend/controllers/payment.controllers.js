import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/payment.model.js';
import PaymentAuditLog from '../models/paymentAuditLog.model.js';
import Invoice from '../models/invoice.model.js';
import SalesOrder from '../models/salesOrder.model.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_SECRET || 'dummy_secret'
});

export const createOrder = async (req, res) => {
    try {
        const { invoiceId, amount, currency } = req.body;
        
        if (!invoiceId || !amount) {
            return res.status(400).json({ success: false, message: 'Invoice ID and Amount are required' });
        }

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: currency || "INR",
            receipt: invoiceId.toString()
        };

        const order = await razorpay.orders.create(options);

        const payment = new Payment({
            userId: req.user._id,
            invoiceId,
            razorpayOrderId: order.id,
            amount: amount,
            currency: options.currency,
            status: 'created'
        });
        await payment.save();

        await PaymentAuditLog.create({
            paymentId: payment._id,
            event: 'payment.created',
            status: 'success'
        });

        res.status(201).json({ success: true, order, paymentId: payment._id });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            payment.razorpayPaymentId = razorpay_payment_id;
            payment.status = 'captured';
            payment.verified = true;
            await payment.save();

            await PaymentAuditLog.create({
                paymentId: payment._id,
                event: 'payment.captured',
                status: 'success',
                webhookVerified: false
            });

            const invoice = await Invoice.findById(payment.invoiceId);
            if (invoice) {
                invoice.status = 'paid';
                await invoice.save();

                // Synchronize the Sales Order data to match
                if (invoice.salesOrderId) {
                    const salesOrder = await SalesOrder.findById(invoice.salesOrderId);
                    if (salesOrder) {
                        salesOrder.paymentStatus = 'paid';
                        salesOrder.paidAmount = payment.amount;
                        salesOrder.dueAmount = Math.max(0, salesOrder.total - payment.amount);
                        salesOrder.paymentGateway = 'razorpay';
                        salesOrder.transactionId = razorpay_payment_id;
                        await salesOrder.save();
                    }
                }
            }

            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            payment.status = 'failed';
            await payment.save();

            await PaymentAuditLog.create({
                paymentId: payment._id,
                event: 'payment.failed',
                status: 'signature_mismatch'
            });

            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const razorpayWebhookHandler = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
        const signature = req.headers['x-razorpay-signature'];

        const isValidSignature = Razorpay.validateWebhookSignature(
            JSON.stringify(req.body),
            signature,
            secret
        );

        if (!isValidSignature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ razorpayOrderId: payload.order_id });
        
        if (payment) {
            if (event === 'payment.captured') {
                payment.status = 'captured';
                payment.razorpayPaymentId = payload.id;
                payment.method = payload.method;
                await payment.save();

                await PaymentAuditLog.create({
                    paymentId: payment._id,
                    event: 'payment.captured',
                    status: 'success',
                    webhookVerified: true
                });

                // Update invoice and sales order if not already done by frontend verification
                const invoice = await Invoice.findById(payment.invoiceId);
                if (invoice && invoice.status !== 'paid') {
                    invoice.status = 'paid';
                    await invoice.save();

                    if (invoice.salesOrderId) {
                        const salesOrder = await SalesOrder.findById(invoice.salesOrderId);
                        if (salesOrder) {
                            salesOrder.paymentStatus = 'paid';
                            salesOrder.paidAmount = payment.amount;
                            salesOrder.dueAmount = Math.max(0, salesOrder.total - payment.amount);
                            salesOrder.paymentGateway = 'razorpay';
                            salesOrder.transactionId = payload.id;
                            
                            // Try to map Razorpay method to our enum
                            const methodMap = {
                                card: 'card',
                                upi: 'upi',
                                netbanking: 'bank_transfer'
                            };
                            if (methodMap[payload.method]) {
                                salesOrder.paymentMethod = methodMap[payload.method];
                            }
                            await salesOrder.save();
                        }
                    }
                }
            } else if (event === 'payment.failed') {
                payment.status = 'failed';
                await payment.save();

                await PaymentAuditLog.create({
                    paymentId: payment._id,
                    event: 'payment.failed',
                    status: 'success',
                    webhookVerified: true
                });
            } else if (event === 'refund.processed') {
                payment.status = 'refunded';
                await payment.save();

                await PaymentAuditLog.create({
                    paymentId: payment._id,
                    event: 'refund.processed',
                    status: 'success',
                    webhookVerified: true
                });
            }
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id }).populate('invoiceId');
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const processRefund = async (req, res) => {
    try {
        const { paymentId, amount } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment || payment.status !== 'captured') {
            return res.status(400).json({ success: false, message: 'Invalid payment or state for refund' });
        }

        const refundOptions = {
            payment_id: payment.razorpayPaymentId,
            amount: amount ? Math.round(amount * 100) : undefined
        };

        const refund = await razorpay.payments.refund(refundOptions);

        payment.status = 'refunded';
        await payment.save();

        await PaymentAuditLog.create({
            paymentId: payment._id,
            event: 'refund.processed',
            status: 'success'
        });

        res.status(200).json({ success: true, data: refund });
    } catch (error) {
        console.error('Refund Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
