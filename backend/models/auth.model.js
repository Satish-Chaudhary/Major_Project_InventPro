import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'accountant', 'staff', 'warehouse staff', 'sales staff'],
        default: 'staff'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'rejected'],
        default: 'pending'
    },
    resetOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const User = mongoose.model("User", UserSchema);

export default User;