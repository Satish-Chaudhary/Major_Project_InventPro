import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, ShieldCheck, Package, AlertTriangle,
    TrendingUp, ArrowUpDown, History, Bell,
    CheckCircle2, XCircle, Info, ChevronRight,
    Plus, Search, Filter, Download
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { clsx } from 'clsx';

const AdminDashboard = () => {
    const { dashboardData } = useApp();
    const [stats, setStats] = useState({
        totalProducts: '2.5k',
        inventoryQty: '12.8k',
        lowStock: '14',
        pendingRequests: '5',
        activeUsers: '124',
        ordersToday: '42',
        suppliers: '18'
    });

    const statCards = [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: ShieldCheck, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <ShieldCheck className="w-6 h-6 text-purple-400" />
                        </div>
                        ADMIN CONTROL CENTER
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">System-wide monitoring and administrative management.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                        <Download className="w-4 h-4" /> Export Data
                    </button>
                    <button className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-cyan-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> System Setup
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all shadow-2xl"
                    >
                        <div className={clsx("absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40", stat.bg)} />

                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx("p-3 rounded-2xl border", stat.bg, stat.color.replace('text-', 'border-').replace('400', '500/20'))}>
                                <stat.icon className={clsx("w-6 h-6", stat.color)} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            <h2 className="text-3xl font-black text-white mt-1 tracking-tighter">{stat.value}</h2>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inventory Trends Chart */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                Inventory Analytics
                            </h3>
                            <p className="text-slate-500 text-xs mt-1 font-medium italic">Stock levels vs consumption metrics over last 6 months</p>
                        </div>
                        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                            {['6M', '1Y', 'ALL'].map(t => (
                                <button key={t} className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-black transition-all", t === '6M' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300')}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dashboardData.stockTrendData}>
                                <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="stock" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                                <Area type="monotone" dataKey="sold" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSold)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Audit Log / Recent Activity */}
                <div className="bg-[#0a0a0a] border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4 text-cyan-400" />
                            Activity Stream
                        </h3>
                        <Bell className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                        {dashboardData.recentActivity.map((log) => (
                            <div key={log.id} className="group flex gap-3 p-3 rounded-2xl hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-800">
                                <div className={clsx(
                                    "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border font-black text-[10px]",
                                    log.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        log.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            log.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                )}>
                                    {log.user.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white leading-tight">{log.action}: <span className="text-slate-400">{log.item}</span></p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-500 uppercase font-black">{log.user}</span>
                                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                        <span className="text-[10px] text-slate-600 font-medium italic">{log.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="p-4 border-t border-slate-800 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] bg-slate-900/10 hover:bg-slate-900/30 transition-all flex items-center justify-center gap-2">
                        View Complete Logs <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
