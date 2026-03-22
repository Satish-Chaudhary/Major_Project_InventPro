import React from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, Globe, Cpu, ShieldAlert, Zap, 
    MonitorSmartphone, Server, Database, Clock, 
    RefreshCcw, MoreHorizontal, TrendingUp 
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { clsx } from 'clsx';
import { useApp } from '../context/AppContext';

const AdminDashboard = () => {
    const { dashboardData } = useApp();
    const { stats } = dashboardData;

    // Sample data for the admin chart
    const chartData = [
        { name: '00:00', value: 400 },
        { name: '04:00', value: 300 },
        { name: '08:00', value: 600 },
        { name: '12:00', value: 800 },
        { name: '16:00', value: 500 },
        { name: '20:00', value: 700 },
        { name: '23:59', value: 600 },
    ];

    const activityLogs = [
        { id: 1, user: 'Admin Alpha', action: 'Modified System Perimeter', time: '2m ago', type: 'security' },
        { id: 2, user: 'System Bot', action: 'Automatic Node Rebalancing', time: '15m ago', type: 'sync' },
        { id: 3, user: 'Root User', action: 'Elevated Manager Privileges', time: '1h ago', type: 'auth' },
        { id: 4, user: 'Security Scan', action: 'No Vulnerabilities Found', time: '3h ago', type: 'grant' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight text-uppercase">System Command Center</h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Real-time infrastructure health and operational throughput.</p>
                </div>
                <div className="flex bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <MonitorSmartphone className="w-3.5 h-3.5" /> Core
                    </button>
                    <button className="px-4 py-2 text-slate-500 hover:text-slate-300 transition-all rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" /> Nodes
                    </button>
                </div>
            </div>

            {/* Stats Grid - Matching Dashboard.jsx */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'System Reach', value: '48.2k', trend: '+12%', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Resource Load', value: '14.5%', trend: '-2%', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                    { label: 'Security Alerts', value: '02', trend: 'Stable', icon: ShieldAlert, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Daily Revenue', value: '$8.4k', trend: '+5%', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx('p-3 rounded-xl bg-slate-800/50', stat.bg)}>
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
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">OPERATIONAL THROUGHPUT</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                                />
                                <Area type="smooth" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#purpleGradient)" dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight uppercase">System Sentinel</h3>
                    <div className="space-y-4 flex-1">
                        {[
                            { label: 'DB Sync Health', value: 98.4, color: 'text-emerald-400', icon: Database },
                            { label: 'Network Stability', value: 99.1, color: 'text-purple-400', icon: Activity },
                            { label: 'Node Reliability', value: 87.5, color: 'text-cyan-400', icon: Server },
                            { label: 'Global Latency', value: 24, color: 'text-amber-400', unit: 'ms', icon: Clock },
                        ].map((node, i) => (
                            <div key={i} className="p-4 bg-slate-800/20 rounded-xl border border-transparent hover:border-slate-700/50 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <node.icon className={clsx("w-4 h-4", node.color)} />
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{node.label}</span>
                                    </div>
                                    <span className={clsx("text-sm font-bold", node.color)}>{node.value}{node.unit || '%'}</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={clsx("h-full rounded-full bg-current", node.color)} style={{ width: `${node.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Recent Activity</h3>
                    <div className="space-y-4">
                        {activityLogs.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-800/20 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 group">
                                <div className={clsx(
                                    'w-2 h-10 rounded-full transition-all group-hover:h-12',
                                    activity.type === 'grant' && 'bg-emerald-500',
                                    activity.type === 'security' && 'bg-amber-500',
                                    activity.type === 'auth' && 'bg-purple-500',
                                    activity.type === 'sync' && 'bg-cyan-500'
                                )} />
                                <div className="flex-1">
                                    <p className="text-white text-sm font-semibold">{activity.user}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{activity.action}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 text-lg tracking-tight">System Infrastructure</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Primary Database', status: 'Stable', details: '99.9% Uptime', icon: Server, color: 'text-emerald-400' },
                            { name: 'Auth Microservice', status: 'Active', details: 'Load: 12%', icon: Clock, color: 'text-purple-400' },
                            { name: 'Cache Layer', status: 'Optimal', details: 'Hit Rate: 94%', icon: Activity, color: 'text-cyan-400' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/20 rounded-xl border border-transparent hover:border-purple-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-linear-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
                                        <item.icon className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{item.name}</p>
                                        <p className="text-slate-400 text-xs font-medium">{item.details}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={clsx("text-xs font-bold px-2 py-1 rounded-lg bg-slate-800", item.color)}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
