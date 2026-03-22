import mongoose from "mongoose";

const AccessRequestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    department: {
        type: String
    },
    requestedRole: {
        type: String,
        enum: ['root', 'admin', 'manager', 'accountant', 'staff', 'warehouse staff', 'sales staff'],
        default: 'staff'
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String
    }
}, { timestamps: true });

const AccessRequest = mongoose.model("AccessRequest", AccessRequestSchema);

export default AccessRequest;
