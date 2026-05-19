import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    default: 'UPI'
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'processing', 'captured', 'failed', 'cancelled', 'refunded', 'reconciliation_pending'],
    default: 'created'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('Payment', paymentSchema)
