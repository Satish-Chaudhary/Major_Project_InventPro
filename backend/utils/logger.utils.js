import ActivityLog from "../models/activityLog.model.js";

/**
 * Log an activity to the database
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Description of the action (e.g., 'Created Category: Electronics')
 * @param {string} module - Module name (auth, inventory, users, roles, orders, suppliers, reports)
 * @param {object} details - Additional details about the action
 * @param {string} ipAddress - IP address of the user
 */
export const logActivity = async (userId, action, module, details = {}, ipAddress = '') => {
    try {
        const log = new ActivityLog({
            userId,
            action,
            module,
            details,
            ipAddress
        });
        await log.save();
        return log;
    } catch (error) {
        console.error("Failed to save activity log:", error);
        // We don't want to throw error here to avoid breaking the main operation if logging fails
    }
};
