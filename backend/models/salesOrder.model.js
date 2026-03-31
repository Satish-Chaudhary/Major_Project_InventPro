import mongoose from 'mongoose'

const salesOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    sku: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discountTotal: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    required: true
  },
  shippingAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'draft'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'credit', 'upi', 'none'],
    default: 'none'
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'none'],
    default: 'none'
  },
  transactionId: String,
  paymentDueDate: Date,
  shippingDetails: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    shippedDate: Date,
    estimatedDelivery: Date
  },
  notes: String,
  termsAndConditions: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Auto-generate order number
salesOrderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    const SalesOrder = mongoose.model('SalesOrder');
    const count = await SalesOrder.countDocuments();
    this.orderNumber = `SO${String(count + 1).padStart(8, '0')}`;
  }
})

// Update customer totals
salesOrderSchema.post('save', async function(doc) {
  if (doc.orderStatus !== 'cancelled') {
      const Customer = mongoose.model('Customer')
      await Customer.findByIdAndUpdate(doc.customer, {
        $inc: {
          totalSpent: doc.total,
          totalOrders: 1
        }
      })
  }
})

export default mongoose.model('SalesOrder', salesOrderSchema)
