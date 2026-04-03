import mongoose from "mongoose";

const DownloadLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    format: {
        type: String,
        enum: ['CSV', 'PDF', 'XLSX'],
        required: true
    },
    fileName: String,
    recordCount: {
        type: Number,
        default: 0
    },
    fileSize: String,
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
}, { timestamps: true });

const ReportSchema = new mongoose.Schema({
    reportType: {
        type: String,
        enum: ['Inventory', 'Sales', 'Audit'],
        required: true
    },
    schedule: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        default: 'Monthly'
    },
    format: {
        type: String,
        enum: ['PDF', 'CSV', 'Excel'],
        default: 'PDF'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Report = mongoose.model("Report", ReportSchema);
const DownloadLog = mongoose.model("DownloadLog", DownloadLogSchema);

export { Report, DownloadLog };
