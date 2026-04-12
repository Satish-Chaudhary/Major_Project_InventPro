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
        default: 'staff'
    },
    department: {
        type: String,
        default: 'General'
    },
    profilePic: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive', 'rejected'],
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
    },
    otpAttempts: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

const User = mongoose.model("User", UserSchema);

export default User;