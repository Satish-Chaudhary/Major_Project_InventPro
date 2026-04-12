import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { useGetCustomersQuery } from '../redux/slices/customerSlice';
import { exportToCSV } from '../utils/exportUtils';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const SalesPerformance = () => {
  const [timeframe, setTimeframe] = useState('month'); // 'day', 'month', 'year'
  const { data: ordersData } = useGetSalesOrdersQuery({ limit: 1000 });
  const { data: customersData } = useGetCustomersQuery();

  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders :
    Array.isArray(ordersData) ? ordersData : [];
  const customers = customersData?.customers || [];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
  const pendingOrders = orders.filter(o => o.paymentStatus === 'pending' || o.paymentStatus === 'partial').length;

  const trendData = [];
  const now = new Date();

  if (timeframe === 'day') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const label = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });

      const dayOrders = orders.filter(o => {
        const od = new Date(o.createdAt);
        return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });

      const revenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const count = dayOrders.length;

      trendData.push({ label, revenue, orders: count });
    }
  } else if (timeframe === 'year') {
    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const label = year.toString();

      const yearOrders = orders.filter(o => new Date(o.createdAt).getFullYear() === year);

      const revenue = yearOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const count = yearOrders.length;

      trendData.push({ label, revenue, orders: count });
    }
  } else {
    // Month view (default)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });

      const monthOrders = orders.filter(o => {
        const od = new Date(o.createdAt);
        return od.toLocaleString('default', { month: 'short' }) === label && od.getFullYear() === d.getFullYear();
      });

      const revenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const count = monthOrders.length;

      trendData.push({ label, revenue, orders: count });
    }
  }

  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.orderStatus === 'delivered').length },
    { name: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length },
    { name: 'Shipped', value: orders.filter(o => o.orderStatus === 'shipped').length },
    { name: 'Confirmed', value: orders.filter(o => o.orderStatus === 'confirmed').length },
    { name: 'Cancelled', value: orders.filter(o => o.orderStatus === 'cancelled').length },
  ].filter(d => d.value > 0);

  const topCustomers = [...customers]
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, 5)
    .map(c => ({
      name: c.name,
      orders: c.totalOrders || 0,
      spent: c.totalSpent || 0
    }));

  const exportReport = () => {
    const reportData = orders.map(o => ({
      OrderNumber: o.orderNumber,
      Customer: o.customer?.name || 'N/A',
      Date: new Date(o.createdAt).toLocaleDateString(),
      Items: o.items?.length || 0,
      Subtotal: o.subtotal || 0,
      Tax: o.taxAmount || 0,
      Total: o.total || 0,
      PaymentStatus: o.paymentStatus,
      OrderStatus: o.orderStatus
    }));
    exportToCSV(reportData, `sales_performance_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sales Performance Report</h2>
          <p className="text-slate-500 text-sm mt-1">Revenue analytics and sales trends</p>
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
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Revenue</span>
          </div>
          <p className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Orders</span>
          </div>
          <p className="text-3xl font-black text-white">{totalOrders}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Avg Order Value</span>
          </div>
          <p className="text-3xl font-black text-white">${avgOrderValue.toFixed(2)}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Active Customers</span>
          </div>
          <p className="text-3xl font-black text-white">{customers.filter(c => c.isActive).length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white ">Revenue Trend</h3>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['day', 'month', 'year'].map((pt) => (
                <button
                  key={pt}
                  onClick={() => setTimeframe(pt)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === pt
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-500">No data available</div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Order Status Distribution</h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-500">No data available</div>
          )}
        </div>
      </div>

      {/* Top Customers & Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Customers</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{customer.name}</p>
                    <p className="text-slate-500 text-xs">{customer.orders} orders</p>
                  </div>
                </div>
                <p className="text-emerald-400 font-bold">${customer.spent.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <ArrowUp className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">Paid Orders</span>
              </div>
              <span className="text-emerald-400 font-bold">{paidOrders}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <ArrowDown className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">Pending</span>
              </div>
              <span className="text-amber-400 font-bold">{pendingOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesPerformance;