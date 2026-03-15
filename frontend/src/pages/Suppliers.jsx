import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Mail, Phone, Edit3, Trash2,
    Search, Shield, CheckCircle2, MoreVertical,
    MapPin, Clock, ArrowUpRight, Download, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

const Suppliers = () => {
    const navigate = useNavigate();
    const { suppliers } = useApp();
    const [activeSuppliersTab, setActiveSuppliersTab] = useState('all');

    const filteredSuppliers = activeSuppliersTab === 'all'
        ? suppliers
        : suppliers.filter(s => s.status.toLowerCase() === activeSuppliersTab);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Suppliers</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all text-sm font-bold">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => navigate('/add-supplier')}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-lg shadow-purple-500/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Supplier
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-800 px-2">
                {['all', 'active', 'inactive'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveSuppliersTab(tab)}
                        className={clsx(
                            "py-4 text-sm font-bold capitalize transition-all relative",
                            activeSuppliersTab === tab ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {tab} Suppliers
                        {activeSuppliersTab === tab && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name, email or code..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-48 appearance-none cursor-pointer">
                    <option>All Categories</option>
                </select>
                <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-48 appearance-none cursor-pointer">
                    <option>Status</option>
                </select>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/40 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-8 py-5 w-12 text-center"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></th>
                                <th className="px-8 py-5">Company</th>
                                <th className="px-8 py-5">Contact Person</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5">Categories</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredSuppliers.map((sup) => (
                                <tr key={sup.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6 text-center"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all">
                                                <Shield className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{sup.company}</p>
                                                <p className="text-slate-500 text-[10px] font-mono tracking-tighter uppercase">{sup.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-linear-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                {sup.contact.charAt(0)}
                                            </div>
                                            <p className="text-slate-300 text-sm font-medium">{sup.contact}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-white text-xs font-medium flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-slate-500" />
                                                {sup.email}
                                            </p>
                                            <p className="text-slate-500 text-[10px] flex items-center gap-2 font-mono">
                                                <Phone className="w-3 h-3 text-slate-600" />
                                                {sup.phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1.5">
                                            {sup.categories.map(cat => (
                                                <span key={cat} className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 text-[9px] font-bold uppercase rounded-md tracking-tighter">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            sup.status === 'Active' ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                                        )}>
                                            {sup.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                                            <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Suppliers;
