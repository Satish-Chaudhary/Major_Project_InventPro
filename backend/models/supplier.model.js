import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
    company: { type: String, required: true },
    code: { type: String, unique: true },
    contact: { type: String },
    email: { type: String },
    phone: { type: String },
    categories: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    reliability: { type: Number, default: 100 },
    location: { type: String }
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", SupplierSchema);
export default Supplier;
