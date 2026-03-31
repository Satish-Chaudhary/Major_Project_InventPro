import {
    Activity, Package, AlertTriangle, TrendingUp,
    Clock, Database, Server
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { clsx } from 'clsx';
import { motion } from 'framer-motion'
import { useGetSummaryReportQuery, useGetSalesPerformanceQuery } from '../redux/slices/reportSlice';
import { useGetActivitiesQuery } from '../redux/slices/activitySlice';
import { format } from 'date-fns';

const AdminDashboard = () => {
    const { data: summaryData } = useGetSummaryReportQuery();
    const { data: activityData } = useGetActivitiesQuery({ limit: 6 });
    const { data: salesPerformance } = useGetSalesPerformanceQuery({ period: 'today' });

    const stats = [
        { label: 'Total Products', value: (summaryData?.inventory?.total || 0).toString(), trend: '+12%', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Low Stock', value: (summaryData?.inventory?.lowStock || 0).toString(), trend: 'Stable', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Pending Orders', value: (summaryData?.orders?.pending || 0).toString(), trend: 'Active', icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Total Revenue', value: `$${(summaryData?.revenue?.total || 0).toLocaleString()}`, trend: '+5%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    // Chart data mapping
    const chartData = salesPerformance?.hourly?.map(point => ({
        name: point.hour,
        value: point.revenue
    })) || [
        { name: '08:00', value: 400 },
        { name: '12:00', value: 800 },
        { name: '16:00', value: 500 },
        { name: '20:00', value: 700 }
    ];

    const activityLogs = activityData?.activities?.map(act => ({
        id: act._id,
        user: act.user,
        action: act.action,
        module: act.module,
        time: act.createdAt && !isNaN(new Date(act.createdAt)) ? format(new Date(act.createdAt), 'HH:mm') : '--:--',
        type: act.module === 'Security' ? 'security' : 'sync'
    })) || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[24px] font-bold text-slate-500 uppercase tracking-widest">Admin Dashboard</h2>
                    <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-widest">System overview and operational metrics</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
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

            {/* Charts + Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Operational Throughput Chart */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Operational Throughput</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} fontSize={11} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={11} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                                />
                                <Area type="smooth" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#purpleGradient)" dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Recent Activity</h3>
                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                        {activityLogs.length > 0 ? activityLogs.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-800/20 rounded-xl hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-700/50 group">
                                <div className={clsx(
                                    'w-1.5 h-8 rounded-full shrink-0',
                                    activity.type === 'security' && 'bg-amber-500',
                                    activity.type === 'sync' && 'bg-cyan-500',
                                    activity.type === 'auth' && 'bg-purple-500',
                                    !['security', 'sync', 'auth'].includes(activity.type) && 'bg-emerald-500'
                                )} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs font-semibold truncate">{activity.user}</p>
                                    <p className="text-slate-400 text-[10px] mt-0.5 truncate">{activity.action}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{activity.time}</p>
                                    <p className="text-slate-600 text-[9px] font-bold uppercase mt-0.5">{activity.module}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">No activity yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
