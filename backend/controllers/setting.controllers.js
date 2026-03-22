import Setting from "../models/setting.model.js";
import { logActivity } from "../utils/logger.utils.js";

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
