import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, TrendingDown, Package,
    Users, DollarSign, Calendar, Download,
    ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar,
    PieChart, Pie, Cell
} from 'recharts';
import { clsx } from 'clsx';

const Analytics = () => {
    const data = [
        { name: 'Mon', revenue: 4000, orders: 240 },
        { name: 'Tue', revenue: 3000, orders: 198 },
        { name: 'Wed', revenue: 5000, orders: 300 },
        { name: 'Thu', revenue: 2780, orders: 208 },
        { name: 'Fri', revenue: 6890, orders: 480 },
        { name: 'Sat', revenue: 2390, orders: 380 },
        { name: 'Sun', revenue: 3490, orders: 430 },
    ];

    const pieData = [
        { name: 'Delivered', value: 400, color: '#8b5cf6' },
        { name: 'Processing', value: 300, color: '#06b6d4' },
        { name: 'Cancelled', value: 100, color: '#f43f5e' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Analytics Insights</h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Deep dive into your inventory and sales performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                        <Calendar className="w-4 h-4" />
                        Last 7 Days
                    </button>
                    <button className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:brightness-110">
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: '$24,892', trend: '+14%', icon: DollarSign, color: 'purple' },
                    { label: 'Active Users', value: '1,204', trend: '+8%', icon: Users, color: 'cyan' },
                    { label: 'Order Volume', value: '842', trend: '-2%', icon: Package, color: 'rose' },
                    { label: 'Conversion', value: '12.4%', trend: '+4%', icon: Activity, color: 'emerald' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                        <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`} />
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={clsx("text-xs font-black uppercase tracking-widest flex items-center gap-1", stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400')}>
                                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-2xl font-black text-white mt-1 tabular-nums">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight">Revenue Operations</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Revenue</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} dy={10} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white tracking-tight mb-8">Order Logistics</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={10}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-6">
                        {pieData.map(item => (
                            <div key={item.name} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-sm text-white font-black">{item.value} units</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
