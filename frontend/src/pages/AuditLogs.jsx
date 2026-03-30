import React, { useMemo, useState } from 'react';
import {
    History, Search, Filter, ArrowUpDown,
    Download, Shield, Calendar, User,
    FileText, CheckCircle2, AlertCircle,
    Package, Users, ShieldCheck, ShoppingBag,
    Truck, Settings, ChevronLeft, ChevronRight, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useGetActivitiesQuery } from '../redux/slices/activitySlice';
import { useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import { format } from 'date-fns';

const AuditLogs = () => {
    const user = useAppSelector(selectUser);
    const { data: activityData, isLoading } = useGetActivitiesQuery({ limit: 100 });
    const auditLogs = activityData?.activities || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [moduleFilter, setModuleFilter] = useState('All Modules');
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 12;

    const modules = [
        'All Modules', 'auth', 'inventory', 'users', 'roles', 'orders', 'suppliers', 'reports', 'settings'
    ];

    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const matchesSearch =
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.userId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.module.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesModule = moduleFilter === 'All Modules' || log.module === moduleFilter;

            return matchesSearch && matchesModule;
        });
    }, [auditLogs, searchQuery, moduleFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
    const displayedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

    const getModuleIcon = (module) => {
        switch (module) {
            case 'auth': return ShieldCheck;
            case 'inventory': return Package;
            case 'users': return Users;
            case 'roles': return Shield;
            case 'orders': return ShoppingBag;
            case 'suppliers': return Truck;
            case 'settings': return Settings;
            default: return FileText;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">System Audit logs</h2>
                    <p className="text-slate-500 text-sm mt-1">Track every operation across the platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-slate-800/50 text-slate-300 px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all font-bold text-xs uppercase tracking-widest cursor-not-allowed opacity-50">
                        <Download className="w-4 h-4" />
                        Export Logs
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by action, user, or module..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all backdrop-blur-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            value={moduleFilter}
                            onChange={(e) => setModuleFilter(e.target.value)}
                            className="bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-10 text-xs font-bold uppercase tracking-wider text-slate-300 focus:outline-none focus:border-purple-500/50 appearance-none min-w-[180px]"
                        >
                            {modules.map(mod => (
                                <option key={mod} value={mod} className="bg-slate-900">{mod.charAt(0).toUpperCase() + mod.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-8 py-5">Event Detail</th>
                                <th className="px-8 py-5">Performed By</th>
                                <th className="px-8 py-5">System Module</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Execution Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : displayedLogs.length > 0 ? (
                                displayedLogs.map((log, i) => {
                                    const Icon = getModuleIcon(log.module);
                                    return (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-slate-800/30 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
                                                        <Icon className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <div className="max-w-md">
                                                        <p className="text-white font-bold text-sm leading-tight tracking-tight">
                                                            {log.action?.includes(' ') ? log.action : log.action?.replace(/_/g, ' ')}
                                                        </p>
                                                        {!log.action?.includes(' ') && (log.details?.newUser || log.details?.updatedUser || log.details?.deletedUser || '') && (
                                                            <span className="text-[10px] text-slate-500 font-medium block mt-1">
                                                                 Target: {log.details.newUser || log.details.updatedUser || log.details.deletedUser}
                                                             </span>
                                                         )}
                                                         {log.ipAddress && (
                                                             <span className="text-[8px] text-slate-600 font-black uppercase mt-1 flex items-center gap-1">
                                                                 <Fingerprint className="w-2.5 h-2.5" /> {log.ipAddress}
                                                             </span>
                                                         )}
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="px-8 py-6">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 shadow-sm overflow-hidden p-0.5 relative group-hover:ring-2 ring-purple-500/50 transition-all">
                                                         <img
                                                             src={`https://i.pravatar.cc/100?u=${log.userId?.email || 'system'}`}
                                                             className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all"
                                                             alt=""
                                                         />
                                                     </div>
                                                     <div>
                                                         <p className="text-xs text-white font-bold">{log.userId?.fullName || 'System'}</p>
                                                         <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{log.userId?.role || 'Service'}</p>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="px-8 py-6">
                                                 <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                                     {log.module}
                                                 </span>
                                             </td>
                                             <td className="px-8 py-6">
                                                 <div className="flex items-center gap-2">
                                                     <CheckCircle2 className="w-4 h-4 text-emerald-500/80" />
                                                     <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/90 italic">Verified</span>
                                                 </div>
                                             </td>
                                             <td className="px-8 py-6 text-right">
                                                 <div className="space-y-1">
                                                     <p className="text-xs text-white font-bold">{log.createdAt ? format(new Date(log.createdAt), 'MMM dd, yyyy') : 'N/A'}</p>
                                                     <p className="text-[10px] text-slate-500 font-medium">{log.createdAt ? format(new Date(log.createdAt), 'HH:mm:ss') : 'N/A'}</p>
                                                 </div>
                                             </td>
                                         </motion.tr>
                                     );
                                 })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <History className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                            <p className="text-slate-500 font-medium text-sm">No activity records match your current criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Showing <span className="text-white">{(currentPage - 1) * logsPerPage + 1}</span> to <span className="text-white">{Math.min(currentPage * logsPerPage, filteredLogs.length)}</span> of <span className="text-white">{filteredLogs.length}</span> entries
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={clsx(
                                        "w-9 h-9 rounded-lg text-xs font-bold transition-all border",
                                        currentPage === i + 1
                                            ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                                            : "border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AuditLogs;
