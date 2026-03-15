import User from '../../models/auth.model.js';
import ActivityLog from '../../models/activityLog.model.js';
import AccessRequest from '../../models/accessRequest.model.js';
import Product from '../../models/product.model.js';
import Order from '../../models/order.model.js';
import Supplier from '../../models/supplier.model.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ status: 'active' });
        const pendingRequests = await AccessRequest.countDocuments({ status: 'pending' });
        const totalProducts = await Product.countDocuments();
        const suppliersCount = await Supplier.countDocuments();
        const ordersTodayCount = await Order.countDocuments({
            createdAt: { $gte: new Date().setHours(0,0,0,0) }
        });

        const lowStockItems = await Product.find({
            $expr: { $lte: ["$initialQty", "$lowStockThreshold"] }
        });

        const totalQty = await Product.aggregate([
            { $group: { _id: null, total: { $sum: "$initialQty" } } }
        ]);

        const stats = {
            totalProducts,
            totalInventoryQuantity: totalQty[0]?.total || 0,
            lowStockAlerts: lowStockItems.length,
            pendingStaffAccessRequests: pendingRequests,
            totalActiveUsers: totalUsers,
            ordersToday: ordersTodayCount,
            suppliersCount: suppliersCount
        };

        const recentActivity = await ActivityLog.find()
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            stats,
            recentActivity
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
