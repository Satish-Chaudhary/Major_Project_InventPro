import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, Plus, Search, Filter, 
    MoreVertical, Truck, CheckCircle2, 
    Clock, AlertTriangle, ChevronRight, 
    Download, Eye, PackageCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { useGetPurchaseOrdersQuery } from '../redux/slices/vendorSlice';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PurchaseOrders = () => {
    const navigate = useNavigate();
    const { data: poData, isLoading } = useGetPurchaseOrdersQuery();
    const purchaseOrders = poData?.pos || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredPOs = purchaseOrders.filter(po => {
        const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             po.supplier?.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || po.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getPOStatusBadge = (status) => {
        const badges = {
            'draft': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
            'sent': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'partially-received': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            'received': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'cancelled': 'bg-red-500/10 text-red-400 border-red-500/20'
        };
        return (
            <span className={clsx(
                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                badges[status] || badges.draft
            )}>
                {status.replace('-', ' ')}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Purchase Orders</h2>
                    <p className="text-slate-400 text-xs font-medium mt-1">Inventory replenishment & procurement</p>
                </div>
                <button 
                    onClick={() => navigate('/create-po')}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-2xl hover:brightness-110 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Create New PO
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Open POs', value: purchaseOrders.filter(p => ['sent', 'partially-received'].includes(p.status)).length, icon: Truck, color: 'text-blue-400' },
                    { label: 'Pending Delivery', value: purchaseOrders.filter(p => !p.receivedDate && p.status !== 'cancelled').length, icon: Clock, color: 'text-amber-400' },
                    { label: 'Total Value', value: `$${purchaseOrders.reduce((sum, p) => sum + (p.totalAmount || 0), 0).toLocaleString()}`, icon: ShoppingBag, color: 'text-purple-400' },
                    { label: 'Completed', value: purchaseOrders.filter(p => p.status === 'received').length, icon: CheckCircle2, color: 'text-emerald-400' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                         <div className="flex items-center justify-between mb-4">
                            <stat.icon className={clsx("w-6 h-6", stat.color)} />
                         </div>
                         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                         <p className="text-2xl font-black text-white mt-1 tabular-nums">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-4xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between bg-slate-800/10">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search POs or Suppliers..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium" 
                        />
                    </div>
                    <div className="flex items-center gap-3">
                         <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 focus:outline-none appearance-none min-w-[140px] text-center"
                         >
                            <option>All</option>
                            <option>Draft</option>
                            <option>Sent</option>
                            <option>Received</option>
                            <option>Cancelled</option>
                         </select>
                         <button className="p-3 bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all">
                            <Download className="w-4 h-4" />
                         </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-slate-800 bg-slate-800/5">
                                <th className="px-8 py-6">PO Number</th>
                                <th className="px-8 py-6">Supplier</th>
                                <th className="px-8 py-6">Items / Total</th>
                                <th className="px-8 py-6 text-center">Status</th>
                                <th className="px-8 py-6">Expected</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredPOs.length > 0 ? filteredPOs.map((po, idx) => (
                                <motion.tr 
                                    key={po._id} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-800/20 transition-all group cursor-pointer"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center font-mono text-[10px] font-black text-purple-400 border border-purple-500/20">
                                                PO
                                            </div>
                                            <span className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">{po.poNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-xs font-black text-white leading-none mb-1">{po.supplier?.company || 'N/A'}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{po.supplier?.contact || 'Contact'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black">{po.items?.length || 0} Products</span>
                                            <span className="text-xs font-black text-purple-400 font-mono mt-1">${(po.totalAmount || 0).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {getPOStatusBadge(po.status)}
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">
                                            {po.expectedDate ? format(new Date(po.expectedDate), 'MMM dd, yyyy') : 'No Date'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right text-slate-500">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {['sent', 'partially-received'].includes(po.status) && (
                                                <button className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-all" title="Receive Items">
                                                    <PackageCheck className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <ShoppingBag className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                            <p className="text-slate-500 font-medium text-sm">No Purchase Orders found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default PurchaseOrders;
