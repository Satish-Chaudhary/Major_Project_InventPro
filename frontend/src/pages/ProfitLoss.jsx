import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Percent, Calculator, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { useGetPurchaseOrdersQuery } from '../redux/slices/purchaseOrderSlice';
import { exportToCSV } from '../utils/exportUtils';

const ProfitLoss = () => {
  const [timeframe, setTimeframe] = useState('month'); // 'day', 'month', 'year'
  const { data: productsData } = useGetProductsQuery({ limit: 1000 });
  const { data: salesOrdersData } = useGetSalesOrdersQuery({ limit: 1000 });
  const { data: purchaseOrdersData } = useGetPurchaseOrdersQuery({ limit: 1000 });

  const products = productsData?.products || [];
  const salesOrders = Array.isArray(salesOrdersData?.orders) ? salesOrdersData.orders : 
                      Array.isArray(salesOrdersData) ? salesOrdersData : [];
  const purchaseOrders = Array.isArray(purchaseOrdersData?.pos) ? purchaseOrdersData.pos : 
                         Array.isArray(purchaseOrdersData) ? purchaseOrdersData : [];

  const totalRevenue = salesOrders
    .filter(o => o.paymentStatus === 'paid' || o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const totalCost = purchaseOrders
    .filter(po => po.status === 'completed' || po.status === 'received')
    .reduce((sum, po) => sum + (po.total || 0), 0);

  const productCostValue = products.reduce((sum, p) => sum + (p.initialQty * (p.costPrice || 0)), 0);
  const productRetailValue = products.reduce((sum, p) => sum + (p.initialQty * (p.basePrice || 0)), 0);

  const grossProfit = totalRevenue - totalCost;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const potentialProfit = productRetailValue - productCostValue;

  const trendData = [];
  const now = new Date();
  
  if (timeframe === 'day') {
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const label = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        
        const daySales = salesOrders.filter(o => {
            const od = new Date(o.createdAt);
            return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
        });

        const dayPurchases = purchaseOrders.filter(po => {
            const pd = new Date(po.createdAt);
            return pd.getDate() === d.getDate() && pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
        });

        const revenue = daySales.reduce((sum, o) => sum + (o.total || 0), 0);
        const cost = dayPurchases.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

        trendData.push({ label, revenue, cost, profit: revenue - cost });
    }
  } else if (timeframe === 'year') {
    for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const label = year.toString();
        
        const yearSales = salesOrders.filter(o => new Date(o.createdAt).getFullYear() === year);
        const yearPurchases = purchaseOrders.filter(po => new Date(po.createdAt).getFullYear() === year);

        const revenue = yearSales.reduce((sum, o) => sum + (o.total || 0), 0);
        const cost = yearPurchases.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

        trendData.push({ label, revenue, cost, profit: revenue - cost });
    }
  } else {
    // Month view (default)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });

      const monthSales = salesOrders.filter(o => {
        const od = new Date(o.createdAt);
        return od.toLocaleString('default', { month: 'short' }) === label && od.getFullYear() === d.getFullYear();
      });

      const monthPurchases = purchaseOrders.filter(po => {
        const pd = new Date(po.createdAt);
        return pd.toLocaleString('default', { month: 'short' }) === label && pd.getFullYear() === d.getFullYear();
      });

      const revenue = monthSales.reduce((sum, o) => sum + (o.total || 0), 0);
      const cost = monthPurchases.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

      trendData.push({ label, revenue, cost, profit: revenue - cost });
    }
  }

  const categoryProfit = products.reduce((acc, p) => {
    const catName = p.category?.catName || 'Uncategorized';
    if (!acc[catName]) {
      acc[catName] = { revenue: 0, cost: 0 };
    }
    acc[catName].revenue += p.initialQty * (p.basePrice || 0);
    acc[catName].cost += p.initialQty * (p.costPrice || 0);
    return acc;
  }, {});

  const categoryData = Object.entries(categoryProfit).map(([name, data]) => ({
    name: name.length > 12 ? name.slice(0, 12) + '...' : name,
    fullName: name,
    revenue: data.revenue,
    cost: data.cost,
    profit: data.revenue - data.cost
  })).filter(d => d.profit !== 0).slice(0, 6);

  const exportReport = () => {
    const reportData = products.map(p => ({
      Product: p.productName,
      SKU: p.skuId,
      Quantity: p.initialQty,
      UnitPrice: p.basePrice,
      UnitCost: p.costPrice || 0,
      Revenue: (p.initialQty * (p.basePrice || 0)).toFixed(2),
      Cost: (p.initialQty * (p.costPrice || 0)).toFixed(2),
      Profit: ((p.initialQty * (p.basePrice || 0)) - (p.initialQty * (p.costPrice || 0))).toFixed(2)
    }));
    exportToCSV(reportData, `profit_loss_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Profit & Loss Report</h2>
          <p className="text-slate-500 text-sm mt-1">Financial performance and profit margins</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all text-sm font-medium"
        >
          <Calculator className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Revenue</span>
          </div>
          <p className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Cost</span>
          </div>
          <p className="text-3xl font-black text-white">${totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Gross Profit</span>
          </div>
          <p className="text-3xl font-black text-emerald-400">${grossProfit.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <Percent className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Gross Margin</span>
          </div>
          <p className="text-3xl font-black text-white">{grossMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Trend */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Profit Trend</h3>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['day', 'month', 'year'].map((pt) => (
                    <button
                        key={pt}
                        onClick={() => setTimeframe(pt)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            timeframe === pt 
                                ? "bg-purple-600 text-white shadow-lg" 
                                : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        {pt}
                    </button>
                ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Cost */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenue vs Cost</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Profit Breakdown */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Profit by Category</h3>
        {categoryData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase border-b border-slate-800">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3 text-right">Cost</th>
                  <th className="px-4 py-3 text-right">Profit</th>
                  <th className="px-4 py-3 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {categoryData.map((cat, idx) => (
                  <tr key={idx} className="text-slate-300 hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-white">{cat.fullName}</td>
                    <td className="px-4 py-3 text-right">${cat.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-red-400">${cat.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-bold">${cat.profit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${cat.revenue > 0 && cat.profit > 0
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                        }`}>
                        {cat.revenue > 0 ? ((cat.profit / cat.revenue) * 100).toFixed(1) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">No category profit data available</div>
        )}
      </div>

      {/* Potential Profit Summary */}
      <div className="bg-slate-900/40 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Inventory Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total Inventory Retail Value</p>
            <p className="text-2xl font-black text-white">${productRetailValue.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total Inventory Cost Value</p>
            <p className="text-2xl font-black text-white">${productCostValue.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Potential Gross Profit</p>
            <p className="text-2xl font-black text-emerald-400">${potentialProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfitLoss;