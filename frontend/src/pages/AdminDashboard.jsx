import {
    Activity, Package, AlertTriangle, TrendingUp,
    Clock, Database, Server, Users, Shield
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { clsx } from 'clsx';
import { motion } from 'framer-motion'
import { useGetSummaryReportQuery, useGetSalesPerformanceQuery } from '../redux/slices/reportSlice';
import { useGetActivitiesQuery } from '../redux/slices/activitySlice';
import { useGetPendingRequestsQuery } from '../redux/slices/adminSlice';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const { data: summaryResponse } = useGetSummaryReportQuery();
    const { data: activityData } = useGetActivitiesQuery({ limit: 6 });
    const { data: salesPerformanceResponse } = useGetSalesPerformanceQuery({ period: 'today' });
    const { data: pendingRequestsData } = useGetPendingRequestsQuery();

    const summary = summaryResponse?.data || {};
    const salesPerformance = salesPerformanceResponse?.hourly || [];
    const pendingCount = pendingRequestsData?.requests?.filter(r => r.status === 'pending').length || 0;

    const stats = [
        { label: 'Total Products', value: (summary.productCount || 0).toString(), trend: '+0%', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Low Stock Alerts', value: (summary.stockStatus?.low || 0).toString(), trend: summary.stockStatus?.out > 0 ? 'Urgent' : 'Stable', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Pending Users', value: pendingCount.toString(), trend: 'Required', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Total Revenue', value: `$${(summary.totalSales || 0).toLocaleString()}`, trend: '+0%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    // Chart data mapping
    const chartData = salesPerformance.length > 0 ? salesPerformance.map(point => ({
        name: point.hour,
        value: point.revenue
    })) : [
        { name: '08:00', value: 0 },
        { name: '12:00', value: 0 },
        { name: '16:00', value: 0 },
        { name: '20:00', value: 0 }
    ];

    const activityLogs = activityData?.activities?.map(act => ({
        id: act._id,
        user: act.user?.fullName || 'System',
        action: act.action,
        module: act.module,
        time: act.createdAt && !isNaN(new Date(act.createdAt)) ? format(new Date(act.createdAt), 'HH:mm') : '--:--',
        type: act.module?.toLowerCase()
    })) || [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-6 h-[calc(100vh-2rem)] flex flex-col gap-6 overflow-hidden bg-black/20"
        >
            {/* Header with Connectivity Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2 pt-2">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        Command Center
                    </h2>
                    <p className="text-slate-500 text-[10px] sm:text-xs mt-1 font-black uppercase tracking-[0.2em] opacity-80 pl-1">Unified Operational Intelligence</p>
                </div>
                
                <div className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 px-5 py-2.5 rounded-2xl shadow-2xl">
                    <div className="flex items-center gap-2.5 group">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)] group-hover:scale-125 transition-transform" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">Core Database Linked</span>
                    </div>
                    <div className="w-px h-5 bg-slate-800" />
                    <div className="flex items-center gap-2.5 hover:text-purple-400 cursor-help transition-colors">
                        <Server className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">Node-01: Active</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Fixed Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={stat.label}
                        className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/40 rounded-2xl p-5 hover:border-purple-500/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
                        <div className="flex items-center justify-between mb-3">
                            <div className={clsx('p-2.5 rounded-xl bg-slate-800/40', stat.bg)}>
                                <stat.icon className={clsx('w-5 h-5', stat.color)} />
                            </div>
                            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-tighter px-2 py-1 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-all">{stat.trend}</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                        <p className="text-2xl font-black text-white mt-1 tabular-nums group-hover:translate-x-1 transition-transform">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Multi-Panel Section - Flexible Height */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Operational Throughput Chart */}
                <div className="lg:col-span-2 bg-slate-900/30 backdrop-blur-sm border border-slate-800/40 rounded-3xl p-8 flex flex-col min-h-0 shadow-inner group">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2.5 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-base tracking-widest uppercase">System Throughput</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-widest opacity-60">Real-time Transaction Density</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">Live: 24h</div>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full min-h-0 pt-4">
                        <ResponsiveContainer width="100%" height="95%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} strokeOpacity={0.3} />
                                <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} dy={15} fontSize={10} fontStyle="bold" />
                                <YAxis stroke="#475569" axisLine={false} tickLine={false} fontSize={10} fontStyle="bold" tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ 
                                        backgroundColor: '#0f172a', 
                                        border: '1px solid #334155', 
                                        borderRadius: '16px',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#purpleGradient)" 
                                    dot={false} 
                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#fff', shadow: '0 0 20px #8b5cf6' }} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/40 rounded-3xl p-8 flex flex-col min-h-0 shadow-2xl overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:rotate-12 transition-transform">
                                <Clock className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="text-white font-black text-base tracking-widest uppercase">Identity Log</h3>
                        </div>
                    </div>
                    
                    <div className="overflow-y-auto custom-scrollbar pr-2 h-full">
                        <div className="space-y-4">
                            {activityLogs.length > 0 ? activityLogs.map((activity, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.05) }}
                                    key={activity.id} 
                                    className="flex items-start gap-4 p-4 border border-slate-800/30 bg-slate-800/10 rounded-2xl hover:bg-slate-800/30 hover:border-slate-700/50 transition-all group/item relative overflow-hidden"
                                >
                                    <div className={clsx(
                                        'w-1.5 h-10 rounded-full shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all group-hover/item:h-12',
                                        activity.type === 'security' && 'bg-amber-500 shadow-amber-500/20',
                                        activity.type === 'auth' && 'bg-purple-500 shadow-purple-500/20',
                                        activity.type === 'reports' && 'bg-cyan-500 shadow-cyan-500/20',
                                        activity.type === 'inventory' && 'bg-blue-500 shadow-blue-500/20',
                                        !['security', 'auth', 'reports', 'inventory'].includes(activity.type) && 'bg-emerald-500 shadow-emerald-500/20'
                                    )} />
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-white text-xs font-black truncate tracking-wide leading-none group-hover/item:text-purple-400 transition-colors">{activity.user}</p>
                                            <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest tabular-nums ml-2 opacity-60">{activity.time}</span>
                                        </div>
                                        <p className="text-slate-400 text-[10px] font-bold truncate uppercase tracking-tight opacity-80 leading-tight">{activity.action}</p>
                                        <div className="mt-2 text-[8px] font-black text-slate-700 uppercase tracking-widest inline-block px-2 py-0.5 bg-slate-900/50 rounded border border-slate-800/50">#{activity.module}</div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                    <Database className="w-12 h-12 text-slate-800 mb-4 animate-pulse" />
                                    <p className="text-slate-700 text-[11px] font-black uppercase tracking-widest">Awaiting Synchronization</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
