import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, Search, ShieldCheck, Mail, Calendar, CheckCircle2, XCircle, ChevronRight, Info, User as UserIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

const UserApprovals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('pending'); // pending, approved, rejected
    const [expandedUser, setExpandedUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch pending requests from backend
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/api/auth/pending-requests`, { withCredentials: true });
            if (response.data.success) {
                setAllUsers(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to fetch user requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/approve/${id}`, {}, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/reject/${id}`, {}, { withCredentials: true });
            if (response.data.success) {
                toast.error(response.data.message);
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        }
    };

    const handleReset = async (id) => {
        toast.info('Status reset functionality pending backend route');
    };

    const filteredUsers = allUsers.filter(user => {
        const matchesFilter = user.status === activeFilter;
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        pending: allUsers.filter(u => u.status === 'pending').length,
        approved: allUsers.filter(u => u.status === 'approved').length,
        rejected: allUsers.filter(u => u.status === 'rejected').length,
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <ShieldCheck className="w-5 h-5 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">User Verifications</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Streamlined workflow for auditing staff access requests.</p>
                </div>

                <div className="flex bg-[#0a0a0a] border border-slate-800 p-1 rounded-xl shadow-2xl">
                    {[
                        { id: 'pending', label: 'Pending', icon: Clock, count: stats.pending, color: 'text-amber-400' },
                        { id: 'approved', label: 'Approved', icon: CheckCircle2, count: stats.approved, color: 'text-emerald-400' },
                        { id: 'rejected', label: 'Rejected', icon: XCircle, count: stats.rejected, color: 'text-red-400' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveFilter(tab.id); setExpandedUser(null); }}
                            className={clsx(
                                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all",
                                activeFilter === tab.id
                                    ? "bg-slate-800 text-white shadow-lg shadow-black"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <tab.icon className={clsx("w-3.5 h-3.5", activeFilter === tab.id ? tab.color : "")} />
                            {tab.label}
                            <span className={clsx(
                                "ml-1.5 px-1.5 py-0.5 rounded-md text-[10px]",
                                activeFilter === tab.id ? "bg-purple-500/20 text-purple-400" : "bg-slate-900 text-slate-600"
                            )}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar - Compact */}
            <div className="bg-[#0f172a]/20 border border-slate-800/50 p-2 rounded-2xl mb-6 backdrop-blur-md">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter list by identity, credentials or department..."
                        className="w-full bg-[#050505] border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-slate-300 focus:outline-none focus:border-purple-500/30 transition-all placeholder:text-slate-600 shadow-inner text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Compact List View */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0a] border border-slate-800 rounded-3xl">
                        <ClipLoader color='#8b5cf6' size={40} />
                        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Records...</p>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className={clsx(
                                "bg-[#0a0a0a] border border-slate-800/80 rounded-2xl transition-all duration-300 overflow-hidden group hover:border-slate-700 shadow-xl shadow-black/20",
                                expandedUser === user._id ? "ring-1 ring-purple-500/30" : ""
                            )}
                        >
                            {/* Main Row */}
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 lg:p-5">
                                {/* Identity Column */}
                                <div className="flex items-center gap-4 w-full md:w-1/4">
                                    <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-purple-500/30 transition-colors shrink-0">
                                        <span className="text-sm font-black text-white uppercase">{user.fullName.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-white truncate">{user.fullName}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-0.5">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Date Column */}
                                <div className="hidden lg:flex items-center gap-2 w-1/4">
                                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                    <span className="text-xs text-slate-400 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>

                                {/* Role Column */}
                                <div className="hidden md:flex items-center gap-2 w-1/4">
                                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                                    <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">{user.role}</span>
                                </div>

                                {/* Actions Column */}
                                <div className="flex items-center gap-2 ml-auto">
                                    {user.status === 'pending' ? (
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg border border-emerald-500/20 transition-all active:scale-90 shadow-lg shadow-emerald-900/10"
                                                title="Approve User"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(user._id)}
                                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all active:scale-90 shadow-lg shadow-red-900/10"
                                                title="Reject User"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleReset(user._id)}
                                            className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
                                            title="Reset to Pending"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="w-px h-6 bg-slate-800 mx-1" />
                                    <button
                                        onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                                        className={clsx(
                                            "p-2 hover:bg-slate-800 rounded-lg transition-all",
                                            expandedUser === user._id ? "rotate-90 bg-slate-800 text-purple-400" : "text-slate-500"
                                        )}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details Section */}
                            {expandedUser === user._id && (
                                <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                    <div className="pt-2 border-t border-slate-800 flex flex-col md:flex-row gap-6">
                                        {/* Contact Info */}
                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <Info className="w-3 h-3" />
                                                Staff Details
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex items-center gap-3 bg-[#050505] p-3 rounded-xl border border-slate-800 shadow-inner">
                                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                                        <Mail className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-600 uppercase font-black">Email Address</p>
                                                        <p className="text-xs text-white break-all">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Right Side: Quick Metadata */}
                                        <div className="w-full md:w-64 space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Record Info</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Request ID</p>
                                                    <p className="text-xs text-white font-mono mt-1">#IP-{user._id.slice(-4)}</p>
                                                </div>
                                                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Date</p>
                                                    <p className="text-xs text-white font-bold mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                                <UserIcon className="w-3.5 h-3.5" />
                                                Full Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )))
                : (
                    <div className="bg-[#0a0a0a] border-2 border-dashed border-slate-800/50 rounded-3xl p-16 text-center shadow-2xl">
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800 overflow-hidden relative">
                                <div className="absolute inset-0 bg-linear-to-b from-purple-500/20 to-transparent" />
                                <ShieldCheck className="w-7 h-7 text-slate-500" />
                            </div>
                            <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-tighter">Zero results found</h2>
                            <p className="text-slate-500 text-xs font-medium max-w-[240px] mx-auto">Try adjusting your filters or search query to find the users you are looking for.</p>
                        </div>
                    )}
            </div>

            {/* Footer Summary - Ultra Slim */}
            <div className="mt-8 py-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                <div className="flex items-center gap-4">
                    <span>Active Audit Mode</span>
                    <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
                </div>
                <div className="text-slate-500">
                    System Version 2.4.0 • Build ID: VERI-552
                </div>
            </div>
        </div>
    );
};

export default UserApprovals;
