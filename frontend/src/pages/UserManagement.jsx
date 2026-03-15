import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Shield, ShieldCheck,
    Key, Mail, Search, MoreVertical,
    ShieldAlert, History, Edit2, Trash2,
    CheckCircle2, XCircle,
    User
} from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const UserManagement = () => {
    const navigate = useNavigate();
    const { users } = useApp();
    const onAddClick = () => navigate('/add-user');
    const [activeSubTab, setActiveSubTab] = useState('all-users');

    const subTabs = [
        { id: 'all-users', label: 'All Users', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: Shield },
        { id: 'audit', label: 'Audit Logs', icon: History },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-xl shadow-purple-500/20 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-800 px-2 overflow-x-auto">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={clsx(
                            "py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                            activeSubTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <tab.icon className={clsx("w-4 h-4", activeSubTab === tab.id ? "text-purple-400" : "text-slate-600")} />
                            {tab.label}
                        </div>
                        {activeSubTab === tab.id && (
                            <motion.div layoutId="subtab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeSubTab === 'all-users' && (
                    <motion.div
                        key="all-users"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Filter Bar */}
                        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full md:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Filter by name or email..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-full md:w-48 appearance-none cursor-pointer">
                                <option>All Roles</option>
                            </select>
                            <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-full md:w-48 appearance-none cursor-pointer">
                                <option>All Status</option>
                            </select>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                        <th className="px-8 py-5 w-12"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></th>
                                        <th className="px-8 py-5">User</th>
                                        <th className="px-8 py-5">Role</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Last Active</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 p-0.5 group-hover:border-purple-500/30 transition-all">
                                                        <img src={`https://i.pravatar.cc/100?u=${u.email}`} alt={u.name} className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm leading-tight">{u.name}</p>
                                                        <p className="text-slate-500 text-xs font-medium md:max-w-[150px] truncate">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={clsx("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-700/50 bg-slate-800/30 shadow-inner", u.color)}>
                                                    {u.role === 'Administrator' ? <ShieldCheck className="w-3 h-3" /> : u.role === 'Manager' ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {u.role}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={clsx("w-1.5 h-1.5 rounded-full", u.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500')} />
                                                    <span className={clsx("text-xs font-bold uppercase tracking-wider", u.status === 'Active' ? 'text-emerald-400' : 'text-slate-500')}>{u.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-300 font-medium">{u.lastActive}</td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                                    <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeSubTab !== 'all-users' && (
                    <motion.div
                        key="coming-soon"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/40 border border-slate-800 rounded-3xl p-20 text-center flex flex-col items-center justify-center h-96"
                    >
                        <div className="w-20 h-20 bg-linear-to-br from-purple-500/10 to-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
                            <ShieldCheck className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Enhanced Control Center</h2>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">We're building advanced policy management and audit transparency features for your organization.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserManagement;
