import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  salesOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesOrder',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  discountTotal: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  dueDate: {
    type: Date,
    required: true
  },
  pdfUrl: String, // Store path to generated PDF
  sentDate: Date,
  paidDate: Date,
  notes: String,
  termsAndConditions: String
}, {
  timestamps: true
})

// Auto-generate invoice number
invoiceSchema.pre('save', async function() {
  if (!this.invoiceNumber) {
    const Invoice = mongoose.model('Invoice');
    const count = await Invoice.countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(6, '0')}`;
  }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)
export default Invoice;
