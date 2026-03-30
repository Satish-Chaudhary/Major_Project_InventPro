import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight, ArrowDownLeft, Search, Plus,
    Download, Filter, MoreVertical, Eye, Trash2,
    FileText, Calendar, ChevronRight, Edit2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { toast } from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
    selectOrderFilters, 
    setOrderFilters, 
    resetOrderFilters,
    useGetOrdersQuery,
    useDeleteOrderMutation
} from '../redux/slices/orderSlice';
import { selectUser } from '../redux/slices/authSlice';

const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectOrderFilters);
    const user = useAppSelector(selectUser);

    const { data: ordersData, isLoading, isFetching } = useGetOrdersQuery(filters);
    const [deleteOrder] = useDeleteOrderMutation();

    const orders = ordersData?.orders || [];
    const orderStats = {
        total: ordersData?.total || 0,
        page: ordersData?.page || 1,
        pages: ordersData?.pages || 1
    };

    const canDelete = user?.role === 'admin' || user?.role === 'manager';
    const confirmDelete = useDeleteWithConfirm();
    const [selectedOrders, setSelectedOrders] = useState([]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > orderStats.pages) return;
        dispatch(setOrderFilters({ page: newPage }));
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedOrders(orders.map(o => o._id || o.id));
        } else {
            setSelectedOrders([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'processing': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const handleEdit = (order) => {
        toast("Edit functionality for orders will be available in the next update.", {
            style: {
                border: '1px solid #f59e0b',
                padding: '16px',
                color: '#f59e0b',
                backgroundColor: '#fffbeb',
            },
            icon: '⚠️'
        });
    };

    const handleDelete = async (id) => {
        confirmDelete({
            title: `Order #${id.slice(-6).toUpperCase()}`,
            onConfirm: async () => {
                await deleteOrder(id);
            }
        });
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
                    {selectedOrders.length > 0 && (
                        <p className="text-purple-400 text-xs font-bold mt-1 uppercase tracking-widest">
                            {selectedOrders.length} orders selected
                        </p>
                    )}
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
                    { id: '', label: 'All Orders' },
                    { id: 'inward', label: 'Inward Stock' },
                    { id: 'outward', label: 'Outward Stock' },
                    { id: 'pending', label: 'Pending Approval' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            if (tab.id === 'pending') {
                                dispatch(setOrderFilters({ status: 'pending', type: '', page: 1 }));
                            } else {
                                dispatch(setOrderFilters({ type: tab.id, status: '', page: 1 }));
                            }
                            setSelectedOrders([]);
                        }}
                        className={clsx(
                            "py-4 text-sm font-bold transition-all relative whitespace-nowrap",
                            (tab.id === 'pending' ? filters.status === 'pending' : filters.type === tab.id) ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {tab.label}
                        {(tab.id === 'pending' ? filters.status === 'pending' : filters.type === tab.id) && (
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
                        value={filters.search || ''}
                        onChange={(e) => dispatch(setOrderFilters({ search: e.target.value, page: 1 }))}
                    />
                </div>
                <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <select
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-40 cursor-pointer appearance-none"
                        value={filters.type || 'All Types'}
                        onChange={(e) => dispatch(setOrderFilters({ type: e.target.value === 'All Types' ? '' : e.target.value.toLowerCase(), page: 1 }))}
                    >
                        <option>All Types</option>
                        <option>Inward</option>
                        <option>Outward</option>
                    </select>
                    <select
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-40 cursor-pointer appearance-none"
                        value={filters.status || 'All Status'}
                        onChange={(e) => dispatch(setOrderFilters({ status: e.target.value === 'All Status' ? '' : e.target.value.toLowerCase(), page: 1 }))}
                    >
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>Processing</option>
                        <option>Pending</option>
                    </select>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-8 py-5 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded bg-slate-900 border-slate-700 checked:bg-purple-500"
                                        onChange={handleSelectAll}
                                        checked={orders.length > 0 && selectedOrders.length === orders.length}
                                    />
                                </th>
                                <th className="px-8 py-5">Order ID</th>
                                <th className="px-8 py-5">Date & Time</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Entity</th>
                                <th className="px-8 py-5">Items</th>
                                <th className="px-8 py-5 focus:outline-none">Total Value</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.length > 0 ? (
                                orders.map((order, idx) => {
                                    const id = order._id || order.id;
                                    return (
                                        <motion.tr
                                            key={id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={clsx(
                                                "hover:bg-slate-800/30 transition-colors group",
                                                selectedOrders.includes(id) && "bg-purple-500/5 shadow-[inset_4px_0_0_#a855f7]"
                                            )}
                                        >
                                            <td className="px-8 py-6 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded bg-slate-900 border-slate-700 checked:bg-purple-500"
                                                    checked={selectedOrders.includes(id)}
                                                    onChange={() => handleSelectOne(id)}
                                                />
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-white tracking-tight">{order.orderId || order.id}</td>
                                            <td className="px-8 py-6">
                                                <p className="text-white text-xs font-bold leading-none">{order.date}</p>
                                                <p className="text-slate-500 text-[10px] font-medium mt-1 leading-none">{order.time}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={clsx(
                                                    "flex items-center gap-2 font-bold text-xs capitalize",
                                                    order.type?.toLowerCase() === 'inward' ? "text-emerald-400" : "text-amber-400"
                                                )}>
                                                    {order.type?.toLowerCase() === 'inward' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                    {order.type}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-300 font-bold">{order.entity}</td>
                                            <td className="px-8 py-6 text-xs text-slate-400 font-medium max-w-[200px] truncate">
                                                {order.itemSummary || (Array.isArray(order.items) ? `${order.items.length} item(s)` : order.items)}
                                            </td>
                                            <td className="px-8 py-6 text-sm text-white font-black tabular-nums">
                                                ${Number(order.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={clsx("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", getStatusStyle(order.status))}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => navigate(`/order/${id}`)}
                                                        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                                                        title="View Order"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(order)}
                                                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                                        title="Edit Order"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(id)}
                                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-8 py-12 text-center text-slate-500 font-bold">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="px-8 py-5 bg-slate-800/10 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                        Page <span className="text-white">{orderStats.page}</span> of <span className="text-white">{orderStats.pages}</span> ({orderStats.total} total orders)
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(orderStats.page - 1)}
                            disabled={orderStats.page <= 1}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all",
                                orderStats.page <= 1
                                    ? "bg-slate-900/50 border-slate-800 text-slate-700 cursor-not-allowed"
                                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => handlePageChange(orderStats.page + 1)}
                            disabled={orderStats.page >= orderStats.pages}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all",
                                orderStats.page >= orderStats.pages
                                    ? "bg-slate-900/50 border-slate-800 text-slate-700 cursor-not-allowed"
                                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Orders;
