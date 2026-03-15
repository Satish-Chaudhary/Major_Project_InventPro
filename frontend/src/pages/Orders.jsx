import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight, ArrowDownLeft, Search, Plus,
    Download, Filter, MoreVertical, Eye,
    FileText, Calendar, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

const Orders = () => {
    const navigate = useNavigate();
    const { orders } = useApp();
    const [activeOrderTab, setActiveOrderTab] = useState('all');
    /* ... earlier ... */

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'processing': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Orders & Stock Movement</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all text-sm font-bold shadow-lg">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => navigate('/add-order')}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-lg shadow-purple-500/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Create Order
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-800 px-2 overflow-x-auto">
                {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'inward', label: 'Inward Stock' },
                    { id: 'outward', label: 'Outward Stock' },
                    { id: 'pending', label: 'Pending Approval' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveOrderTab(tab.id)}
                        className={clsx(
                            "py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                            activeOrderTab === tab.id ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {tab.label}
                        {activeOrderTab === tab.id && (
                            <motion.div layoutId="order-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by ID, customer, or supplier..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50"
                    />
                </div>
                <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-40 cursor-pointer appearance-none">
                        <option>All Types</option>
                        <option>Inward</option>
                        <option>Outward</option>
                    </select>
                    <select className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-40 cursor-pointer appearance-none">
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>Processing</option>
                        <option>Pending</option>
                    </select>
                    <div className="relative w-40">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="dd-mm-yyyy" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-300 focus:outline-none" />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-8 py-5 w-12"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></th>
                                <th className="px-8 py-5">Order ID</th>
                                <th className="px-8 py-5">Date & Time</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Entity</th>
                                <th className="px-8 py-5">Items</th>
                                <th className="px-8 py-5">Total Value</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.map((order, idx) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-800/30 transition-colors group"
                                >
                                    <td className="px-8 py-6"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></td>
                                    <td className="px-8 py-6 text-sm font-bold text-white tracking-tight">{order.id}</td>
                                    <td className="px-8 py-6">
                                        <p className="text-white text-xs font-bold leading-none">{order.date}</p>
                                        <p className="text-slate-500 text-[10px] font-medium mt-1 leading-none">{order.time}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={clsx(
                                            "flex items-center gap-2 font-bold text-xs capitalize",
                                            order.type === 'inward' ? "text-emerald-400" : "text-amber-400"
                                        )}>
                                            {order.type === 'inward' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            {order.type}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-300 font-bold">{order.entity}</td>
                                    <td className="px-8 py-6 text-xs text-slate-400 font-medium">{order.items}</td>
                                    <td className="px-8 py-6 text-sm text-white font-black tabular-nums">{order.value}</td>
                                    <td className="px-8 py-6">
                                        <span className={clsx("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", getStatusStyle(order.status))}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                                            <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><FileText className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Orders;
