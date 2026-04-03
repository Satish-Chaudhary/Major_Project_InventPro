import express from 'express';
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Supplier from '../models/supplier.model.js';
import Customer from '../models/customer.model.js';
import SalesOrder from '../models/salesOrder.model.js';
import Invoice from '../models/invoice.model.js';
import User from '../models/auth.model.js';
import ActivityLog from '../models/activityLog.model.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

router.get('/health/ready', authMiddleware, async (req, res) => {
  try {
    await Product.countDocuments().limit(1);
    await User.countDocuments().limit(1);
    
    res.status(200).json({
      success: true,
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'not ready',
      error: error.message
    });
  }
});

router.get('/metrics', authMiddleware, authorize(['admin', 'root']), async (req, res) => {
  try {
    const [
      productsCount,
      categoriesCount,
      suppliersCount,
      customersCount,
      ordersCount,
      invoicesCount,
      usersCount,
      recentActivities
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Supplier.countDocuments(),
      Customer.countDocuments(),
      SalesOrder.countDocuments(),
      Invoice.countDocuments(),
      User.countDocuments(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const products = await Product.find().lean();
    const totalInventoryValue = products.reduce((sum, p) => 
      sum + (p.initialQty * (p.basePrice || 0)), 0
    );
    const totalInventoryCost = products.reduce((sum, p) => 
      sum + (p.initialQty * (p.costPrice || 0)), 0
    );

    const orders = await SalesOrder.find().lean();
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const metrics = {
      database: {
        products: productsCount,
        categories: categoriesCount,
        suppliers: suppliersCount,
        customers: customersCount,
        orders: ordersCount,
        invoices: invoicesCount,
        users: usersCount
      },
      inventory: {
        totalValue: totalInventoryValue,
        totalCost: totalInventoryCost,
        potentialProfit: totalInventoryValue - totalInventoryCost
      },
      sales: {
        totalOrders: ordersCount,
        totalRevenue: totalRevenue,
        avgOrderValue: ordersCount > 0 ? totalRevenue / ordersCount : 0
      },
      recentActivity: recentActivities.length,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    };

    res.status(200).json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch metrics',
      error: error.message
    });
  }
});

router.get('/stats/dashboard', authMiddleware, async (req, res) => {
  try {
    const [
      products,
      customers,
      suppliers,
      orders,
      users
    ] = await Promise.all([
      Product.find().lean(),
      Customer.find().lean(),
      Supplier.find().lean(),
      SalesOrder.find().sort({ createdAt: -1 }).limit(10).lean(),
      User.find().lean()
    ]);

    const lowStockProducts = products.filter(p => p.initialQty <= (p.lowStockThreshold || 10));
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.initialQty * (p.basePrice || 0)), 0);
    
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;

    const stats = {
      inventory: {
        totalProducts: products.length,
        lowStock: lowStockProducts.length,
        outOfStock: products.filter(p => p.initialQty === 0).length,
        totalValue: totalInventoryValue
      },
      customers: {
        total: customers.length,
        active: customers.filter(c => c.isActive).length
      },
      suppliers: {
        total: suppliers.length,
        active: suppliers.filter(s => s.status === 'Active').length
      },
      orders: {
        total: orders.length,
        recent: orders.slice(0, 5),
        totalRevenue
      },
      users: {
        total: users.length,
        active: activeUsers,
        pending: pendingUsers
      }
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

export default router;