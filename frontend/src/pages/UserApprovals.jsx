import React, { useState, useEffect } from 'react';
import { 
    UserCheck, UserX, Clock, Search, ShieldCheck, 
    Mail, Calendar, CheckCircle2, XCircle, 
    ChevronRight, Info, User as UserIcon,
    Filter, ArrowUpDown, History, Fingerprint,
    ShieldAlert, Activity, MoreHorizontal,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { useApp } from '../context/AppContext';

const UserApprovals = () => {
    const { fetchAuditLogs } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('pending'); // pending, active, rejected
    const [expandedUser, setExpandedUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/auth/pending-requests`, { withCredentials: true });
            if (response.data.success) {
                setAllUsers(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Sync failed: Persistence node unreachable');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id, name) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/approve/${id}`, {}, { withCredentials: true });
            if (response.data.success) {
                toast.success(`Access granted: ${name}`);
                fetchRequests();
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authorization failed');
        }
    };

    const handleReject = async (id, name) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/reject/${id}`, { reason: 'Policy non-compliance' }, { withCredentials: true });
            if (response.data.success) {
                toast.error(`Access denied: ${name}`);
                fetchRequests();
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Revocation failed');
        }
    };

    const filteredUsers = allUsers.filter(user => {
        const statusToMatch = activeFilter === 'approved' ? 'active' : activeFilter;
        const matchesFilter = user.status === statusToMatch;
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        pending: allUsers.filter(u => u.status === 'pending').length,
        approved: allUsers.filter(u => u.status === 'active').length,
        rejected: allUsers.filter(u => u.status === 'rejected').length,
    };

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
                    <h2 className="text-2xl font-bold text-white tracking-tight">User Verifications</h2>
                    <p className="text-slate-400 text-sm mt-1">Audit and authorize staff access requests into the system.</p>
                </div>

                <div className="flex bg-slate-900/40 border border-slate-800 p-1 rounded-xl shadow-xl">
                    {[
                        { id: 'pending', label: 'Queued', icon: Clock, count: stats.pending, color: 'text-amber-400' },
                        { id: 'approved', label: 'Verified', icon: CheckCircle2, count: stats.approved, color: 'text-emerald-400' },
                        { id: 'rejected', label: 'Revoked', icon: XCircle, count: stats.rejected, color: 'text-red-400' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveFilter(tab.id); setExpandedUser(null); }}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
                                activeFilter === tab.id
                                    ? "bg-slate-800 text-white shadow-lg shadow-black"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <tab.icon className={clsx("w-3.5 h-3.5", activeFilter === tab.id ? tab.color : "text-slate-600")} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={clsx(
                                    "ml-1 px-2 py-0.5 rounded-md text-[9px]",
                                    activeFilter === tab.id ? "bg-purple-500/20 text-purple-400" : "bg-slate-900 text-slate-700"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar - Matching Standard Dashboard Patter */}
            <div className="bg-slate-900/20 border border-slate-800/50 p-1.5 rounded-2xl group transition-all hover:bg-slate-900/40">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                    <input
                        type="text"
                        placeholder="Scan identities by name or email..."
                        className="w-full bg-[#050505] border border-slate-800/80 rounded-xl py-2.5 pl-11 pr-4 text-slate-300 focus:outline-none focus:border-purple-500/40 transition-all placeholder:text-slate-700 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 border border-slate-800 rounded-3xl">
                        <ClipLoader color='#8b5cf6' size={40} />
                        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Records...</p>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((user, idx) => (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={clsx(
                                        "bg-slate-900/20 border border-slate-800/60 rounded-2xl transition-all duration-300 group hover:border-slate-700 shadow-xl overflow-hidden",
                                        expandedUser === user._id ? "ring-1 ring-purple-500/30" : ""
                                    )}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 lg:p-5">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-purple-500/40">
                                                <span className="text-sm font-black text-white uppercase">{user.fullName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white tracking-tight">{user.fullName}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest shrink-0">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                                                {user.role}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-auto">
                                            {user.status === 'pending' && (
                                                <div className="flex bg-slate-950/40 p-1 rounded-xl border border-slate-800/50">
                                                    <button
                                                        onClick={() => handleApprove(user._id, user.fullName)}
                                                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                        title="Grant Access"
                                                    >
                                                        <UserCheck className="w-4.5 h-4.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(user._id, user.fullName)}
                                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Deny Access"
                                                    >
                                                        <UserX className="w-4.5 h-4.5" />
                                                    </button>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                                                className={clsx(
                                                    "p-2 hover:bg-slate-800 rounded-lg transition-all",
                                                    expandedUser === user._id ? "rotate-90 text-purple-400" : "text-slate-500"
                                                )}
                                            >
                                                <ChevronRight className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {expandedUser === user._id && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="px-5 pb-5 border-t border-slate-800/60"
                                        >
                                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                                                    <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Record Metadata</h4>
                                                    <div className="space-y-1 text-xs text-slate-400 font-mono">
                                                        <p>UID: {user._id}</p>
                                                        <p>NODE: AUTH-CLUSTER-01</p>
                                                        <p>STATUS: {user.status.toUpperCase()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-end justify-end gap-3">
                                                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                                                        View Activity Log
                                                    </button>
                                                    <button className="px-4 py-2 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">
                                                        Audit Profile
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-slate-900/10 border-2 border-dashed border-slate-800/50 rounded-3xl p-16 text-center">
                        <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">Queue Empty</h2>
                        <p className="text-slate-500 text-sm font-medium">All access requests have been cleared.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default UserApprovals;
