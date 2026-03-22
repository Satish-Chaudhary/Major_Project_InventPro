import mongoose from "mongoose";

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

export default Report;
