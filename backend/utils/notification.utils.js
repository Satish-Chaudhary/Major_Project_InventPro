import Notification from "../models/notification.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import User from "../models/auth.model.js";

/**
 * Sends a notification to a specific user or group of users by role.
 * @param {Object} options - Notification options
 * @param {String} options.userId - Specific user ID to notify
 * @param {String} options.role - Notify all users with this role
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification message
 * @param {String} options.type - Notification category (order, stock, security, system)
 * @param {Object} options.metadata - Optional metadata for deep linking
 */
export const sendNotification = async ({ userId, role, title, message, type = 'system', metadata = {} }) => {
    try {
        let targetUserIds = [];

        if (userId) {
            targetUserIds.push(userId);
        } else if (role) {
            // Find all active users with this role
            const users = await User.find({ role, status: 'active' }).select('_id');
            targetUserIds = users.map(u => u._id);
        }

        const notifications = targetUserIds.map(uid => ({
            userId: uid,
            title,
            message,
            type,
            metadata
        }));

        // Batch save to database
        const savedNotifications = await Notification.insertMany(notifications);

        // Emit real-time events via Socket.IO
        if (role) {
            // Emit to role-based room
            io.to(`role:${role}`).emit("new:notification", {
                title,
                message,
                type,
                metadata,
                createdAt: new Date()
            });
        } else if (userId) {
            // Emit to specific user's socket
            const socketId = getReceiverSocketId(userId);
            if (socketId) {
                io.to(socketId).emit("new:notification", {
                    title,
                    message,
                    type,
                    metadata,
                    createdAt: new Date()
                });
            }
        }

        return savedNotifications;
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
