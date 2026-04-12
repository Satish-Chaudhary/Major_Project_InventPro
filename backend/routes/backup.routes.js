import express from 'express';
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import Supplier from '../models/supplier.model.js';
import Customer from '../models/customer.model.js';
import SalesOrder from '../models/salesOrder.model.js';
import Invoice from '../models/invoice.model.js';
import User from '../models/auth.model.js';
import Setting from '../models/setting.model.js';
import { authMiddleware } from '../middleware/isAuth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// @desc    Export all data as JSON backup
// @route   GET /api/backup/export
// @access  Private (Admin/Root only)
router.get('/export', authMiddleware, authorize(['admin', 'root']), async (req, res) => {
  try {
    const backup = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      data: {}
    };

    // Update last backup time in settings
    await Setting.findOneAndUpdate({}, { lastBackupTime: new Date() }, { upsert: true });

    backup.data.products = await Product.find().populate('category', 'catName');
    backup.data.categories = await Category.find();
    backup.data.suppliers = await Supplier.find();
    backup.data.customers = await Customer.find();
    backup.data.salesOrders = await SalesOrder.find().populate('customer');
    backup.data.invoices = await Invoice.find();
    backup.data.users = await User.find().select('-password -confirmPassword');

    const stats = {
      products: backup.data.products.length,
      categories: backup.data.categories.length,
      suppliers: backup.data.suppliers.length,
      customers: backup.data.customers.length,
      salesOrders: backup.data.salesOrders.length,
      invoices: backup.data.invoices.length,
      users: backup.data.users.length
    };

    backup.stats = stats;

    if (req.query.format === 'csv') {
      let csv = 'Module,Record Count\n';
      Object.keys(stats).forEach(key => {
        csv += `${key.toUpperCase()},${stats[key]}\n`;
      });
      csv += '\n--- PRODUCT DATA ---\n';
      csv += 'PRODUCT NAME,SKU,CATEGORY,STOCK,UNIT PRICE\n';
      backup.data.products.forEach(p => {
        csv += `"${p.productName}","${p.sku}","${p.category?.catName || 'N/A'}",${p.initialQty},${p.basePrice || 0}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=inventpro_backup_${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=inventpro_backup_${new Date().toISOString().split('T')[0]}.json`);
    res.json(backup);
  } catch (error) {
    console.error('Backup export error:', error);
    res.status(500).json({ success: false, message: 'Export failed', error: error.message });
  }
});

// @desc    Get database statistics
// @route   GET /api/backup/stats
// @access  Private (Admin/Root)
router.get('/stats', authMiddleware, authorize(['admin', 'root']), async (req, res) => {
  try {
    const stats = {
      products: await Product.countDocuments(),
      categories: await Category.countDocuments(),
      suppliers: await Supplier.countDocuments(),
      customers: await Customer.countDocuments(),
      salesOrders: await SalesOrder.countDocuments(),
      invoices: await Invoice.countDocuments(),
      users: await User.countDocuments(),
      activeUsers: await User.countDocuments({ status: 'active' }),
      totalInventoryValue: 0
    };

    const products = await Product.find();
    stats.totalInventoryValue = products.reduce((sum, p) => sum + (p.initialQty * (p.basePrice || 0)), 0);

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get stats', error: error.message });
  }
});

export default router;