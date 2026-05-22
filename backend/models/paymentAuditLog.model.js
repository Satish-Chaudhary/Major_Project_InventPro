import mongoose from 'mongoose';

const paymentAuditLogSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  webhookVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('PaymentAuditLog', paymentAuditLogSchema);
