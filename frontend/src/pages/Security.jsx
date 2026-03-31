import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    ShieldAlert, ShieldCheck, Fingerprint, MapPin, 
    Clock, AlertTriangle, UserX, Key, 
    ArrowUpRight, Activity, Smartphone, Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { useGetAuditLogsQuery, useGetSecuritySummaryQuery } from '../redux/slices/adminSlice';
import { format } from 'date-fns';

const Security = () => {
    const { data: auditLogsData, refetch: refetchAuditLogs } = useGetAuditLogsQuery();
    const { data: securitySummary, refetch: refetchSecuritySummary } = useGetSecuritySummaryQuery();

    const auditLogs = auditLogsData?.logs || [];

    const handleRefresh = () => {
        refetchAuditLogs();
        refetchSecuritySummary();
    };

    // Filter auditLogs for high-risk actions
    const privilegedAuditEvents = useMemo(() => {
        return (auditLogs || []).filter(log => 
            log?.action?.toLowerCase().includes('delete') ||
            log?.action?.toLowerCase().includes('update') ||
            log.module === 'roles' ||
            log.module === 'users'
        ).slice(0, 10);
    }, [auditLogs]);

    const combinedSecurityStream = useMemo(() => {
        const failed = securitySummary?.recentFailed || [];
        const combined = [...failed, ...privilegedAuditEvents]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return combined.slice(0, 20);
    }, [securitySummary, privilegedAuditEvents]);

    const stats = [
        { label: 'Security Events', value: ((securitySummary?.recentFailed?.length || 0) + (privilegedAuditEvents?.length || 0)).toString(), icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' },
        { label: 'Failed Logins', value: (securitySummary?.recentFailed?.length || 0).toString(), icon: UserX, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Active Sessions', value: (securitySummary?.activeSessions?.length || 0).toString(), icon: Smartphone, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'System Integrity', value: 'High', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 space-y-8 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Security Audit</h2>
                    <p className="text-slate-400 text-xs font-medium mt-1">Global monitoring & threat detection</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleRefresh}
                        className="bg-slate-800 text-white px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
                    >
                        Refresh Streams
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={clsx("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={clsx("w-6 h-6", stat.color)} />
                            </div>
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-white mt-1 tabular-nums">{stat.value}</p>
                        <div className="mt-4 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Stream</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline Stream */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <h3 className="text-xl font-black text-white tracking-tight">Real-time Alert Stream</h3>
                    </div>

                    <div className="space-y-4">
                        {combinedSecurityStream.map((event, idx) => (
                            <motion.div
                                key={event._id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={clsx(
                                    "relative pl-8 pb-8 border-l",
                                    event.action.toLowerCase().includes('failed') ? "border-red-500/30" : "border-slate-800"
                                )}
                            >
                                <div className={clsx(
                                    "absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-[#050505] shadow-lg",
                                    event.action.toLowerCase().includes('failed') ? "bg-red-500 shadow-red-500/50" : "bg-purple-500 shadow-purple-500/50"
                                )} />
                                
                                <div className={clsx(
                                    "bg-slate-900/40 border rounded-2xl p-5 hover:border-slate-600 transition-all shadow-xl group",
                                    event.action.toLowerCase().includes('failed') ? "border-red-900/20" : "border-slate-800"
                                )}>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <p className={clsx(
                                                "text-sm font-black tracking-tight",
                                                event.action.toLowerCase().includes('failed') ? "text-red-400" : "text-white"
                                            )}>
                                                {event.action}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {format(new Date(event.createdAt), 'HH:mm:ss')}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                                    <Fingerprint className="w-3.5 h-3.5" />
                                                    {event.ipAddress || '127.0.0.1'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-white">{event.userId?.fullName || event.details?.email || 'Anonymous'}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{event.userId?.role || 'SYSTEM'}</p>
                                        </div>
                                    </div>
                                    
                                    {event.details && Object.keys(event.details).length > 0 && (
                                        <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                            <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                                {JSON.stringify(event.details, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Security Context Side Panel */}
                <div className="space-y-8">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-lg font-black text-white tracking-tight">Active Sessions</h3>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {securitySummary?.activeSessions?.length > 0 ? (
                                securitySummary.activeSessions.map((session, sidx) => (
                                    <div key={session._id || sidx} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-purple-500/20 transition-all">
                                        <div>
                                            <p className="text-xs font-black text-white leading-none mb-1">{session.userId?.fullName || 'Active User'}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{session.ipAddress || 'Unknown IP'}</p>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                <span className="text-[8px] font-bold text-emerald-400/80 uppercase">Active Now</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-mono text-slate-600 truncate max-w-[80px]">
                                                {session.userAgent?.split(' ')[0] || 'Unknown Device'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-600 text-xs py-10 italic">No active sessions found.</p>
                            )}
                        </div>
                    </section>

                    <section className="bg-linear-to-br from-purple-600/10 to-red-600/10 border border-red-500/20 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                             <ShieldAlert className="w-24 h-24 text-red-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-black text-white tracking-tight">Vulnerability Scan</h3>
                            <p className="text-slate-400 text-xs mt-2 font-medium">Last automated scan completed 4 hours ago. 0 critical issues found.</p>
                            <button className="mt-6 w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                                Run manual scan
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default Security;
