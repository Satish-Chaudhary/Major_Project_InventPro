import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { DollarSign, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { useGetCategoriesQuery } from '../redux/slices/categorySlice';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { exportToCSV } from '../utils/exportUtils';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const InventoryValuation = () => {
  const { data: productsData } = useGetProductsQuery({ limit: 1000 });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: ordersData } = useGetSalesOrdersQuery({});

  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : 
                 Array.isArray(ordersData) ? ordersData : [];

  const totalValue = products.reduce((sum, p) => sum + (p.initialQty * (p.basePrice || 0)), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.initialQty * (p.costPrice || 0)), 0);
  const totalItems = products.reduce((sum, p) => sum + p.initialQty, 0);

  const categoryData = categories.map(cat => {
    const catProducts = products.filter(p =>
      Array.isArray(p.category) ? p.category.some(c => c._id === cat._id) : p.category === cat._id || p.category?.catName === cat.catName
    );
    const value = catProducts.reduce((sum, p) => sum + (p.initialQty * (p.basePrice || 0)), 0);
    return { name: cat.catName, value };
  }).filter(d => d.value > 0);

  const topProducts = [...products]
    .sort((a, b) => (b.initialQty * b.basePrice) - (a.initialQty * a.basePrice))
    .slice(0, 10)
    .map(p => ({
      name: p.productName.length > 20 ? p.productName.slice(0, 20) + '...' : p.productName,
      value: p.initialQty * (p.basePrice || 0),
      stock: p.initialQty
    }));

  const stockStatusData = [
    { name: 'In Stock', value: products.filter(p => p.status === 'in stock').length, color: '#10b981' },
    { name: 'Low Stock', value: products.filter(p => p.status === 'low stock').length, color: '#f59e0b' },
    { name: 'Out of Stock', value: products.filter(p => p.status === 'out of stock').length, color: '#ef4444' },
  ];

  const exportReport = () => {
    const reportData = products.map(p => ({
      SKU: p.skuId,
      Product: p.productName,
      Category: p.category?.catName || 'N/A',
      Quantity: p.initialQty,
      UnitPrice: p.basePrice,
      CostPrice: p.costPrice || 0,
      TotalValue: (p.initialQty * (p.basePrice || 0)).toFixed(2),
      TotalCost: (p.initialQty * (p.costPrice || 0)).toFixed(2),
      Status: p.status
    }));
    exportToCSV(reportData, `inventory_valuation_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Valuation Report</h2>
          <p className="text-slate-500 text-sm mt-1">Total inventory value and breakdown by category</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all text-sm font-medium"
        >
          <DollarSign className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Retail Value</span>
          </div>
          <p className="text-3xl font-black text-white">${totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Cost Value</span>
          </div>
          <p className="text-3xl font-black text-white">${totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Potential Profit</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">${(totalValue - totalCost).toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Items</span>
          </div>
          <p className="text-3xl font-black text-white">{totalItems.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value by Category */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Value by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No category data available
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Stock Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products by Value */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Products by Value</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <YAxis type="category" dataKey="name" width={150} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InventoryValuation;