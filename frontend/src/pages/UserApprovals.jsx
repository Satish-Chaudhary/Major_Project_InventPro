import React, { useState } from 'react';
import { UserCheck, UserX, Clock, Search, ShieldCheck, Mail, Building2, Calendar, MessageSquare, CheckCircle2, XCircle, ChevronRight, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

const UserApprovals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('pending'); // pending, approved, rejected
    const [expandedUser, setExpandedUser] = useState(null);

    // Mock data for users
    const [allUsers, setAllUsers] = useState([
        { id: 1, fullName: 'John Doe', email: 'john@example.com', department: 'Inventory', requestedAt: 'Feb 07, 10:30 AM', status: 'pending', reason: 'I need access to manage the upcoming shipment of electronics and update stock levels.' },
        { id: 2, fullName: 'Sarah Miller', email: 'sarah.m@company.com', department: 'Wholesale', requestedAt: 'Feb 07, 11:45 AM', status: 'pending', reason: 'Assigned to the wholesale distribution team. Need access to process bulk orders.' },
        { id: 3, fullName: 'Michael Chen', email: 'm.chen@logistics.net', department: 'Logistics', requestedAt: 'Feb 07, 02:15 PM', status: 'approved', reason: 'Logistics coordinator requiring inventory visibility for route planning.' },
        { id: 4, fullName: 'Emma Wilson', email: 'emma@sales.com', department: 'Sales', requestedAt: 'Feb 08, 09:00 AM', status: 'pending', reason: 'Viewing stock availability for client inquiries.' },
        { id: 5, fullName: 'Robert Ross', email: 'r.ross@tech.org', department: 'IT Support', requestedAt: 'Feb 08, 10:30 AM', status: 'rejected', reason: 'System maintenance and troubleshooting for the backend servers.' },
    ]);

    const handleApprove = (id) => {
        setAllUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: 'approved' } : user
        ));
        toast.success('User approved successfully!');
    };

    const handleReject = (id) => {
        setAllUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: 'rejected' } : user
        ));
        toast.error('User request rejected');
    };

    const handleReset = (id) => {
        setAllUsers(prev => prev.map(user =>
            user.id === id ? { ...user, status: 'pending' } : user
        ));
        toast.info('Status reset to pending');
    };

    const filteredUsers = allUsers.filter(user => {
        const matchesFilter = user.status === activeFilter;
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.department.toLowerCase().includes(searchQuery.toLowerCase());
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
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={clsx(
                                "bg-[#0a0a0a] border border-slate-800/80 rounded-2xl transition-all duration-300 overflow-hidden group hover:border-slate-700 shadow-xl shadow-black/20",
                                expandedUser === user.id ? "ring-1 ring-purple-500/30" : ""
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
                                            <Building2 className="w-3 h-3" />
                                            {user.department}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Column */}
                                <div className="hidden lg:flex items-center gap-2 w-1/4">
                                    <Mail className="w-3.5 h-3.5 text-slate-600" />
                                    <span className="text-xs text-slate-400 truncate">{user.email}</span>
                                </div>

                                {/* Date Column */}
                                <div className="hidden md:flex items-center gap-2 w-1/6">
                                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                    <span className="text-xs text-slate-400 font-medium">{user.requestedAt}</span>
                                </div>

                                {/* Summary Box (Compact reason teaser) */}
                                <div className="flex-1 min-w-[150px] flex items-center gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    <p className="text-[11px] text-slate-500 truncate italic leading-none">
                                        "{user.reason}"
                                    </p>
                                </div>

                                {/* Actions Column */}
                                <div className="flex items-center gap-2 ml-auto">
                                    {user.status === 'pending' ? (
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleApprove(user.id)}
                                                className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg border border-emerald-500/20 transition-all active:scale-90 shadow-lg shadow-emerald-900/10"
                                                title="Approve User"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(user.id)}
                                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all active:scale-90 shadow-lg shadow-red-900/10"
                                                title="Reject User"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleReset(user.id)}
                                            className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
                                            title="Reset to Pending"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className="w-px h-6 bg-slate-800 mx-1" />
                                    <button
                                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                        className={clsx(
                                            "p-2 hover:bg-slate-800 rounded-lg transition-all",
                                            expandedUser === user.id ? "rotate-90 bg-slate-800 text-purple-400" : "text-slate-500"
                                        )}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details Section */}
                            {expandedUser === user.id && (
                                <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                                    <div className="pt-2 border-t border-slate-800 flex flex-col md:flex-row gap-6">
                                        {/* Left Side: Reason focus */}
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <Info className="w-3 h-3" />
                                                Detailed Justification
                                            </h4>
                                            <div className="bg-[#050505] p-4 rounded-xl border border-slate-800 shadow-inner relative">
                                                <p className="text-slate-300 text-sm leading-relaxed italic">
                                                    "{user.reason}"
                                                </p>
                                            </div>
                                        </div>
                                        {/* Right Side: Quick Metadata */}
                                        <div className="w-full md:w-64 space-y-3">
                                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Record Info</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Request ID</p>
                                                    <p className="text-xs text-white font-mono mt-1">#IP-00{user.id}</p>
                                                </div>
                                                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Priority</p>
                                                    <p className="text-xs text-amber-500 font-bold mt-1">Medium</p>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-all uppercase tracking-widest">
                                                View User Profile
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
