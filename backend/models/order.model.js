import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    date: { type: String },
    time: { type: String },
    type: { type: String, enum: ['inward', 'outward'] },
    entity: { type: String }, // Supplier name or Customer name
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        total: { type: Number }
    }],
    itemSummary: { type: String }, // Store the old string summary for compatibility
    value: { type: Number },
    status: { type: String, enum: ['completed', 'processing', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
