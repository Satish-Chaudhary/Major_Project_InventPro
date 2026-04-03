import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Download, Calendar, Package } from 'lucide-react';
import { useGetProductsQuery, useGetLowStockQuery } from '../redux/slices/productSlice';
import { useGetOrdersQuery } from '../redux/slices/orderSlice';
import { exportToCSV } from '../utils/exportUtils';

const StockMovement = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterType, setFilterType] = useState('all');

  const { data: productsData } = useGetProductsQuery({ limit: 1000 });
  const { data: ordersData } = useGetOrdersQuery({ limit: 1000 });
  const { data: lowStockData } = useGetLowStockQuery();

  const products = productsData?.products || [];
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : 
                 Array.isArray(ordersData) ? ordersData : [];
  const lowStockProducts = lowStockData?.products || [];

  const getStockStatus = (product) => {
    if (product.initialQty === 0) return 'out_of_stock';
    if (product.initialQty <= product.lowStockThreshold) return 'low_stock';
    return 'in_stock';
  };

  const stockSummary = products.reduce((acc, product) => {
    const status = getStockStatus(product);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalValue = products.reduce((sum, p) => sum + (p.initialQty * (p.basePrice || 0)), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.initialQty * (p.costPrice || 0)), 0);

  const movementData = [
    { type: 'Purchase Orders', count: orders.filter(o => o.type === 'inward').length, icon: '📥' },
    { type: 'Sales Orders', count: orders.filter(o => o.type === 'outward').length, icon: '📤' },
    { type: 'Returns', count: 0, icon: '↩️' },
    { type: 'Adjustments', count: 0, icon: '🔧' },
  ];

  const exportReport = () => {
    const reportData = products.map(p => ({
      SKU: p.skuId,
      Name: p.productName,
      CurrentStock: p.initialQty,
      Threshold: p.lowStockThreshold,
      Status: p.status,
      Value: (p.initialQty * (p.basePrice || 0)).toFixed(2)
    }));
    exportToCSV(reportData, `stock_movement_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Stock Movement Report</h2>
          <p className="text-slate-500 text-sm mt-1">Track inventory changes and stock levels</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Products</span>
          </div>
          <p className="text-3xl font-black text-white">{products.length}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Stock Value</span>
          </div>
          <p className="text-3xl font-black text-white">${totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Cost Value</span>
          </div>
          <p className="text-3xl font-black text-white">${totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Potential Profit</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">${(totalValue - totalCost).toLocaleString()}</p>
        </div>
      </div>

      {/* Stock Status Distribution */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Stock Status Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-4xl font-black text-emerald-400">{stockSummary.in_stock || 0}</p>
            <p className="text-slate-400 text-sm">In Stock</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="text-4xl font-black text-amber-400">{stockSummary.low_stock || 0}</p>
            <p className="text-slate-400 text-sm">Low Stock</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-4xl font-black text-red-400">{stockSummary.out_of_stock || 0}</p>
            <p className="text-slate-400 text-sm">Out of Stock</p>
          </div>
        </div>
      </div>

      {/* Movement Summary */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Movement Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movementData.map((item, idx) => (
            <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-white font-bold text-xl">{item.count}</p>
              <p className="text-slate-500 text-xs">{item.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-slate-900/40 border border-amber-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-400 mb-4">⚠️ Low Stock Alert</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Current Qty</th>
                  <th className="px-4 py-2">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <tr key={product._id} className="text-slate-300">
                    <td className="px-4 py-3 font-medium">{product.productName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{product.skuId}</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{product.initialQty}</td>
                    <td className="px-4 py-3">{product.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StockMovement;