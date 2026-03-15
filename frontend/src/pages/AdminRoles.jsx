import React, { useState } from 'react';
import {
    Users, ShieldCheck, Settings,
    Lock, Key, Shield, Trash2, Edit3,
    Plus, Search, Filter, CheckCircle2,
    XCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const AdminRoles = () => {
    const [roles, setRoles] = useState([
        { id: 1, name: 'Admin', users: 2, permissions: ['Full Access'], level: 'Critical', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { id: 2, name: 'Manager', users: 5, permissions: ['Product Management', 'Reports', 'Orders'], level: 'High', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { id: 3, name: 'Warehouse Staff', users: 12, permissions: ['Update Stock', 'View Inventory'], level: 'Medium', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        { id: 4, name: 'Sales Staff', users: 8, permissions: ['Sales Entry', 'View Orders'], level: 'Medium', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { id: 5, name: 'Accountant', users: 3, permissions: ['Revenue Reports', 'Supplier Invoices'], level: 'High', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    ]);

    const permissionsList = [
        'create_product', 'edit_product', 'delete_product',
        'update_stock', 'manage_users', 'view_reports',
        'manage_roles', 'manage_suppliers', 'manage_orders'
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        ROLE MANAGEMENT
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium italic underline underline-offset-4 decoration-purple-500/30">Define system access levels and permissions.</p>
                </div>

                <button className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-cyan-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                    <Plus className="w-5 h-5" /> CREATE NEW ROLE
                </button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        key={role.id}
                        className="bg-[#0a0a0a] border border-slate-800 rounded-3xl p-6 flex flex-col group hover:border-slate-700 transition-all shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={clsx("px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest", role.color)}>
                                {role.name}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-600 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-slate-500" />
                                <span className="text-xs text-slate-400 font-bold uppercase">{role.users} Active Users</span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.15em]">CORE PERMISSIONS</p>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((p, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-bold">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse",
                                    role.level === 'Critical' ? 'bg-red-500' :
                                        role.level === 'High' ? 'bg-amber-500' : 'bg-emerald-500'
                                )} />
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{role.level} Level Security</span>
                            </div>
                            <button className="text-[10px] text-purple-400 font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                                View Details <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Permission Matrix Preview */}
            <div className="bg-[#0a0a0a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/20">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        PERMISSION MASTER LIST
                    </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {permissionsList.map((perm, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-2xl border border-slate-800 group hover:border-cyan-500/30 transition-all cursor-default">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-xs text-slate-300 font-bold tracking-tight">{perm.replace('_', ' ').toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminRoles;
