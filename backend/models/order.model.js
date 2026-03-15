import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    date: { type: String },
    time: { type: String },
    type: { type: String, enum: ['inward', 'outward'] },
    entity: { type: String }, // Supplier name or Customer name
    items: { type: String },
    value: { type: String },
    status: { type: String, enum: ['completed', 'processing', 'pending'], default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
