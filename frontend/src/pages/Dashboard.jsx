import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { clsx } from 'clsx';

import { useApp } from '../context/AppContext';

const Dashboard = () => {
    const { dashboardData } = useApp();
    const { stats, stockTrendData, categoryData, recentActivity, inventory, getStatusBadge } = dashboardData;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx('p-3 rounded-xl bg-slate-800/50', stat.color.replace('text-', 'bg-').replace('-400', '-500/10'))}>
                                <stat.icon className={clsx('w-6 h-6', stat.color)} />
                            </div>
                            <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-full">{stat.trend}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-bold text-white mt-2 tabular-nums">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Movement Trends</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stockTrendData}>
                                <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="smooth" dataKey="stock" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Line type="smooth" dataKey="sold" stroke="#06b6d4" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Stock Distribution</h3>
                    <div className="h-[350px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white">45%</span>
                            <span className="text-slate-400 text-xs">Electronics</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-800/20 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 group">
                                <div className={clsx(
                                    'w-2 h-10 rounded-full transition-all group-hover:h-12',
                                    activity.type === 'success' && 'bg-emerald-500',
                                    activity.type === 'warning' && 'bg-amber-500',
                                    activity.type === 'info' && 'bg-cyan-500',
                                    activity.type === 'danger' && 'bg-red-500'
                                )} />
                                <div className="flex-1">
                                    <p className="text-white text-sm font-semibold">{activity.action}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{activity.item}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-300 text-xs font-medium">{activity.user}</p>
                                    <p className="text-slate-500 text-[10px] mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h1 className="text-white font-bold mb-6 text-lg tracking-tight">Inventory Watchlist</h1>
                    <div className="space-y-4">
                        {inventory.filter(i => i.status !== 'in-stock').map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/20 rounded-xl border border-transparent hover:border-amber-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
                                        <Package className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{item.name}</p>
                                        <p className="text-slate-400 text-xs font-mono">{item.sku}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-sm">{item.stock} <span className="text-slate-500 font-normal">in stock</span></p>
                                    <div className="mt-1">{getStatusBadge(item.status)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
