import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag, Search, Filter, Eye, Download,
    CreditCard, Calendar, User, MoreVertical
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useGetSalesOrdersQuery, useUpdateOrderStatusMutation } from '../redux/slices/salesOrderSlice';
import { getStatusBadge } from '../utils/statusBadges';
import toast from 'react-hot-toast';

const SalesOrders = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', search: '' });
    const { data: ordersData, isLoading } = useGetSalesOrdersQuery(filters);
    
    const orders = ordersData?.orders || [];
    const pagination = ordersData?.pagination || { page: 1, pages: 1, total: 0 };

    const getPaymentBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'partial': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
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
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Professional Sales</h2>
                    <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Manage checkouts and client transactions</p>
                </div>
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-lg shadow-purple-500/20"
                >
                    <ShoppingBag className="w-4 h-4" />
                    New Checkout
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full text-slate-300">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500/50"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    />
                </div>
                <select
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-40 cursor-pointer appearance-none"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                >
                    <option value="">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-8 py-5">Order #</th>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Payment</th>
                                <th className="px-8 py-5">Order Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-12 text-center text-slate-500 font-bold animate-pulse">
                                        Loading sales records...
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order, idx) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-8 py-6 text-sm font-bold text-white tracking-tight uppercase">{order.orderNumber}</td>
                                        <td className="px-8 py-6">
                                            <p className="text-white text-sm font-bold">{order.customer?.name || 'Guest'}</p>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{order.customer?.email || 'N/A'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-xs text-slate-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-sm text-white font-black tabular-nums">${order.total?.toFixed(2)}</td>
                                        <td className="px-8 py-6">
                                            <span className={clsx("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", getPaymentBadge(order.paymentStatus))}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={clsx("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", 
                                                order.orderStatus === 'confirmed' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                order.orderStatus === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                order.orderStatus === 'shipped' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                                order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            )}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => navigate(`/sales-order/${order._id}`)}
                                                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-8 py-12 text-center text-slate-500 font-bold">
                                        No sales orders found.
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

export default SalesOrders;
