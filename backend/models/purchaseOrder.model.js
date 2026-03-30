import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema({
    poNumber: {
        type: String,
        required: true,
        unique: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        received: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['pending', 'partial', 'received'],
            default: 'pending'
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'received', 'partially-received', 'cancelled'],
        default: 'draft'
    },
    expectedDate: {
        type: Date
    },
    receivedDate: {
        type: Date
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;
