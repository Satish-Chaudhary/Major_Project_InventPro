import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Truck, Star, Package, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useGetVendorsQuery } from '../redux/slices/vendorSlice';
import { useGetPurchaseOrdersQuery } from '../redux/slices/purchaseOrderSlice';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { exportToCSV } from '../utils/exportUtils';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const VendorPerformance = () => {
  const { data: suppliersData } = useGetVendorsQuery({});
  const { data: purchaseOrdersData } = useGetPurchaseOrdersQuery({ limit: 1000 });
  const { data: productsData } = useGetProductsQuery({ limit: 1000 });

  const suppliers = suppliersData?.suppliers || [];
  const purchaseOrders = Array.isArray(purchaseOrdersData?.pos) ? purchaseOrdersData.pos : 
                         Array.isArray(purchaseOrdersData) ? purchaseOrdersData : [];
  const products = productsData?.products || [];

  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
  const totalPurchaseValue = purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0);
  const avgSupplierValue = suppliers.length > 0 ? totalPurchaseValue / suppliers.length : 0;

  const supplierPerformance = suppliers.map(supplier => {
    const supplierPOs = purchaseOrders.filter(po => po.supplier === supplier._id || po.supplier?.company === supplier.company);
    const totalOrders = supplierPOs.length;
    const totalValue = supplierPOs.reduce((sum, po) => sum + (po.total || 0), 0);
    const onTimeDeliveries = Math.floor(Math.random() * 30) + 70; // Placeholder calculation

    return {
      name: supplier.company.length > 15 ? supplier.company.slice(0, 15) + '...' : supplier.company,
      fullName: supplier.company,
      totalOrders,
      totalValue,
      reliability: supplier.reliability || 85,
      onTime: onTimeDeliveries
    };
  }).filter(s => s.totalValue > 0);

  const topVendors = [...supplierPerformance].sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

  const reliabilityData = [
    { name: 'Excellent (90%+)', value: suppliers.filter(s => (s.reliability || 0) >= 90).length, color: '#10b981' },
    { name: 'Good (70-89%)', value: suppliers.filter(s => (s.reliability || 0) >= 70 && (s.reliability || 0) < 90).length, color: '#06b6d4' },
    { name: 'Fair (50-69%)', value: suppliers.filter(s => (s.reliability || 0) >= 50 && (s.reliability || 0) < 70).length, color: '#f59e0b' },
    { name: 'Poor (<50%)', value: suppliers.filter(s => (s.reliability || 0) < 50).length, color: '#ef4444' },
  ];

  const exportReport = () => {
    const reportData = suppliers.map(s => ({
      Company: s.company,
      Code: s.code,
      Email: s.email,
      Phone: s.phone || '',
      Status: s.status,
      Reliability: s.reliability || 0,
      Location: s.location || ''
    }));
    exportToCSV(reportData, `vendor_performance_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Vendor Performance Report</h2>
          <p className="text-slate-500 text-sm mt-1">Supplier analytics and reliability metrics</p>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all text-sm font-medium"
        >
          <Truck className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Suppliers</span>
          </div>
          <p className="text-3xl font-black text-white">{suppliers.length}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Active Suppliers</span>
          </div>
          <p className="text-3xl font-black text-white">{activeSuppliers}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Purchases</span>
          </div>
          <p className="text-3xl font-black text-white">${totalPurchaseValue.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm font-medium">Avg Supplier Value</span>
          </div>
          <p className="text-3xl font-black text-white">${avgSupplierValue.toFixed(0)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors by Value */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top Vendors by Purchase Value</h3>
          {topVendors.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topVendors} layout="vertical">
                <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Bar dataKey="totalValue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">No vendor data</div>
          )}
        </div>

        {/* Reliability Distribution */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Supplier Reliability Distribution</h3>
          {reliabilityData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reliabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reliabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">No reliability data</div>
          )}
        </div>
      </div>

      {/* Supplier Details Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Supplier Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b border-slate-800">
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reliability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {suppliers.slice(0, 10).map((supplier, idx) => (
                <tr key={idx} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-white">{supplier.company}</td>
                  <td className="px-4 py-3 font-mono text-xs">{supplier.code}</td>
                  <td className="px-4 py-3 text-sm">{supplier.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${supplier.reliability || 85}%` }}
                        />
                      </div>
                      <span className="text-sm">{supplier.reliability || 85}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default VendorPerformance;