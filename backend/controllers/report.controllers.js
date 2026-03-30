import Report from "../models/report.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { logActivity } from "../utils/logger.utils.js";

// @desc    Get real-time summary report (Sales vs Purchases)
// @route   GET /api/reports/summary
export const getSummaryReport = async (req, res) => {
    try {
        const { timeframe = 'all' } = req.query;
        
        let dateFilter = {};
        if (timeframe === 'today') {
            const today = new Date().toISOString().split('T')[0];
            dateFilter = { date: today };
        } else if (timeframe === 'month') {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            dateFilter = { createdAt: { $gte: startOfMonth } };
        }

        // Aggregate orders
        const orders = await Order.find({ ...dateFilter, status: { $ne: 'cancelled' } });
        
        const summary = orders.reduce((acc, order) => {
            const val = Number(order.value) || 0;
            if (order.type === 'outward') {
                acc.totalSales += val;
                acc.salesCount++;
            } else if (order.type === 'inward') {
                acc.totalPurchases += val;
                acc.purchasesCount++;
            }
            return acc;
        }, { totalSales: 0, totalPurchases: 0, salesCount: 0, purchasesCount: 0 });

        // Calculate Inventory Value
        const products = await Product.find();
        const inventoryValue = products.reduce((sum, p) => sum + (p.initialQty * p.costPrice), 0);
        const stockStatus = products.reduce((acc, p) => {
            if (p.status.includes('low')) acc.low++;
            else if (p.status.includes('out')) acc.out++;
            else acc.ok++;
            return acc;
        }, { ok: 0, low: 0, out: 0 });

        res.status(200).json({
            success: true,
            data: {
                ...summary,
                netBalance: summary.totalSales - summary.totalPurchases,
                inventoryValue,
                stockStatus,
                productCount: products.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Log a download/export action
export const logDownload = async (req, res) => {
    try {
        const { reportType, format } = req.body;
        await logActivity(req.user._id, `Exported ${reportType} report as ${format}`, 'reports', { reportType, format }, req.ip);
        res.status(200).json({ success: true, message: "Download logged" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get report schedules
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
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
