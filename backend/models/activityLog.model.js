import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true,
        enum: ['auth', 'inventory', 'users', 'roles', 'orders', 'suppliers', 'reports']
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
