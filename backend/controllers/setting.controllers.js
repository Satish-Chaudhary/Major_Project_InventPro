import Setting from "../models/setting.model.js";
import { logActivity } from "../utils/logger.utils.js";
import User from "../models/auth.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Category from "../models/category.model.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

// @desc    Get system settings
// @route   GET /api/settings/get
export const getSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            // Create default settings if not exists
            setting = new Setting();
            await setting.save();
        }
        res.status(200).json({ success: true, settings: setting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update system settings
// @route   POST /api/settings/update
export const updateSettings = async (req, res) => {
    try {
        const { id } = req.body;
        let setting;
        if (id) {
            setting = await Setting.findByIdAndUpdate(id, req.body, { new: true });
        } else {
            setting = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        }

        // Log activity
        await logActivity(req.user._id, `Updated System Settings`, 'settings', { settings: req.body }, req.ip);

        res.status(200).json({ success: true, message: "System settings updated", settings: setting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get database and system usage stats
// @route   GET /api/settings/system-stats
export const getSystemStats = async (req, res) => {
    try {
        const stats = {
            counts: {
                users: await User.countDocuments(),
                products: await Product.countDocuments(),
                categories: await Category.countDocuments(),
                suppliers: await Supplier.countDocuments(),
                orders: await Order.countDocuments()
            },
            database: {
                dbName: mongoose.connection.name,
                clusterState: mongoose.connection.readyState === 1 ? 'Healthy' : 'Connecting...',
                modelsLoaded: Object.keys(mongoose.models).length
            },
            inventoryValue: (await Product.aggregate([
                { $group: { _id: null, total: { $sum: { $multiply: ["$initialQty", "$costPrice"] } } } }
            ]))[0]?.total || 0,
            revenue: (await Order.aggregate([
                { $match: { type: 'outward', status: 'confirmed' } },
                { $group: { _id: null, total: { $sum: "$value" } } }
            ]))[0]?.total || 0
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
