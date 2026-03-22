import Report from "../models/report.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Log a download/export action
// @route   POST /api/reports/log-download
export const logDownload = async (req, res) => {
    try {
        const { reportType, format } = req.body;
        
        // Log activity
        await logActivity(req.user._id, `Exported ${reportType} report as ${format}`, 'reports', { reportType, format }, req.ip);

        res.status(200).json({ success: true, message: "Download logged" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get report schedules
// @route   GET /api/reports/all
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('userId', 'fullName email');
        res.status(200).json({ success: true, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a report schedule
// @route   POST /api/reports/add
export const createReportSchedule = async (req, res) => {
    try {
        const report = new Report({
            ...req.body,
            userId: req.user._id
        });
        await report.save();

        // Log activity
        await logActivity(req.user._id, `Created ${req.body.reportType} report schedule`, 'reports', { reportId: report._id }, req.ip);

        res.status(201).json({ success: true, message: "Report schedule created", report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
