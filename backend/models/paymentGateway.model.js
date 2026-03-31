import mongoose from 'mongoose'

const paymentGatewaySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal'],
    required: true,
    unique: true
  },
  apiKey: {
    type: String,
    required: true
  },
  apiSecret: {
    type: String,
    required: true
  },
  webhookSecret: String,
  isActive: {
    type: Boolean,
    default: false
  },
  environment: {
    type: String,
    enum: ['test', 'production'],
    default: 'test'
  },
  settings: {
    currency: { type: String, default: 'INR' },
    successUrl: String,
    cancelUrl: String
  }
}, {
  timestamps: true
})

export default mongoose.model('PaymentGateway', paymentGatewaySchema)
