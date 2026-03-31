import Razorpay from 'razorpay'
import Stripe from 'stripe'
import SalesOrder from '../models/salesOrder.model.js'
import Payment from '../models/payment.model.js'
import Customer from '../models/customer.model.js'
import Product from '../models/product.model.js'
import { sendNotification } from '../utils/notification.utils.js'

class PaymentService {
  constructor() {
    // Initialize Razorpay
    if (process.env.RAZORPAY_KEY_ID) {
        this.razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        })
    }
    
    // Initialize Stripe
    if (process.env.STRIPE_SECRET_KEY) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    }
  }
  
  // Create payment intent
  async createPaymentIntent(orderId, paymentMethodType) {
    const order = await SalesOrder.findById(orderId).populate('customer')
    if (!order) throw new Error('Order not found')
    
    let result = { orderId: order._id };
    
    if (paymentMethodType === 'razorpay') {
        const razorpayOrder = await this.razorpay.orders.create({
          amount: Math.round(order.total * 100), // Convert to paise
          currency: 'INR',
          receipt: order.orderNumber,
        });
        result.gatewayOrderId = razorpayOrder.id;
        result.key = process.env.RAZORPAY_KEY_ID;
    } else if (paymentMethodType === 'stripe') {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(order.total * 100),
          currency: 'inr', // Or usd
          metadata: { orderId: order._id.toString() }
        });
        result.clientSecret = paymentIntent.client_secret;
    }
    
    return result;
  }
  
  // Handle successful payment
  async handleSuccessfulPayment(paymentData) {
    const { orderId, transactionId, amount, paymentMethod, gateway } = paymentData
    
    const order = await SalesOrder.findById(orderId).populate('customer')
    if (!order) throw new Error('Order not found')
    
    // Create payment record
    const payment = await Payment.create({
      salesOrderId: orderId,
      customerId: order.customer._id,
      amount,
      paymentMethod,
      paymentGateway: gateway,
      transactionId,
      status: 'completed',
      paymentDate: new Date()
    })
    
    // Update order payment status
    order.paidAmount += amount
    order.dueAmount = Math.max(0, order.total - order.paidAmount)
    
    if (order.paidAmount >= order.total) {
      order.paymentStatus = 'paid'
      order.orderStatus = 'confirmed'
    } else if (order.paidAmount > 0) {
      order.paymentStatus = 'partial'
    }
    
    order.transactionId = transactionId;
    order.paymentMethod = paymentMethod;
    await order.save()
    
    // Update customer stats
    await Customer.findByIdAndUpdate(order.customer._id, {
        $inc: { currentBalance: -amount } // If they had credit debt
    });

    // Notify about payment
    await sendNotification({
        userId: order.customer._id,
        title: 'Payment Successful',
        message: `Your payment of ${amount} for order ${order.orderNumber} was received.`,
        type: 'order',
        metadata: { orderId: order._id }
    });

    return payment
  }
}

export default new PaymentService()
