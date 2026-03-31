import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
  customerNumber: {
    type: String,
    unique: true,
    sparse: true // Allow nulls initially but unique if present
  },
  customerType: {
    type: String,
    enum: ['individual', 'business'],
    default: 'individual'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  companyName: String,
  taxId: String,
  billingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Auto-generate customer number
customerSchema.pre('save', async function() {
  if (!this.customerNumber) {
    const Customer = mongoose.model('Customer');
    const count = await Customer.countDocuments();
    this.customerNumber = `CUST${String(count + 1).padStart(6, '0')}`;
  }
})

export default mongoose.model('Customer', customerSchema)
