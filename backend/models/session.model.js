import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'expired'],
        default: 'active'
    },
    loginAt: {
        type: Date,
        default: Date.now
    },
    logoutAt: {
        type: Date
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Session = mongoose.model("Session", SessionSchema);

export default Session;
