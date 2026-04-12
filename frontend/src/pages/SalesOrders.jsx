import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Search, Eye, Download, RotateCcw,
    CheckCircle, Clock, AlertCircle, XCircle, Package,
    CreditCard, Banknote, IndianRupee, Users, ChevronLeft, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { exportToCSV } from '../utils/exportUtils';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const PaymentBadge = ({ status }) => {
    const styles = {
        paid:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        pending:  'bg-amber-500/10  text-amber-400  border-amber-500/20',
        partial:  'bg-cyan-500/10   text-cyan-400   border-cyan-500/20',
        refunded: 'bg-rose-500/10   text-rose-400   border-rose-500/20',
    };
    return (
        <span className={clsx('px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border', styles[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20')}>
            {status}
        </span>
    );
};

const OrderStatusBadge = ({ status }) => {
    const styles = {
        draft:      'bg-slate-500/10  text-slate-400  border-slate-500/20',
        confirmed:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        processing: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
        shipped:    'bg-cyan-500/10   text-cyan-400   border-cyan-500/20',
        delivered:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        cancelled:  'bg-red-500/10    text-red-400    border-red-500/20',
    };
    return (
        <span className={clsx('px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border', styles[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20')}>
            {status}
        </span>
    );
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', `bg-${color}-500/10`)}>
            <Icon className={clsx('w-6 h-6', `text-${color}-400`)} />
        </div>
        <div className="min-w-0">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
            <p className="text-white font-black text-xl mt-0.5 truncate">{value}</p>
            {sub && <p className="text-slate-600 text-[10px] mt-0.5">{sub}</p>}
        </div>
    </div>
);

const SalesOrders = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ page: 1, limit: 10, status: '', paymentStatus: '', search: '' });
    const { data: ordersData, isLoading, isFetching } = useGetSalesOrdersQuery(filters);

    const orders = ordersData?.orders || [];
    const pagination = ordersData?.pagination || { page: 1, pages: 1, total: 0 };

    // Compute quick stats from returned data
    const totalRevenue   = orders.reduce((s, o) => s + (o.total || 0), 0);
    const paidCount      = orders.filter(o => o.paymentStatus === 'paid').length;
    const pendingCount   = orders.filter(o => o.paymentStatus === 'pending').length;
    const deliveredCount = orders.filter(o => o.orderStatus === 'delivered').length;

    const handleExport = () => {
        const data = orders.map(o => ({
            'Order #':        o.orderNumber,
            'Customer':       o.customer?.name || 'N/A',
            'Email':          o.customer?.email || 'N/A',
            'Items':          o.items?.length || 0,
            'Subtotal (₹)':   o.subtotal,
            'Tax (₹)':        o.taxAmount,
            'Total (₹)':      o.total,
            'Paid (₹)':       o.paidAmount,
            'Due (₹)':        o.dueAmount,
            'Payment':        o.paymentStatus,
            'Status':         o.orderStatus,
            'Method':         o.paymentMethod,
            'Date':           new Date(o.createdAt).toLocaleDateString('en-IN'),
        }));
        exportToCSV(data, `sales_transactions_${new Date().toISOString().split('T')[0]}`);
    };

    const clearFilters = () => setFilters({ page: 1, limit: 10, status: '', paymentStatus: '', search: '' });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Sales Transactions</h2>
                    <p className="text-slate-500 text-sm mt-1">View and manage all client sales orders</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={IndianRupee}   label="Total Revenue"    value={formatCurrency(totalRevenue)}  sub={`${orders.length} orders shown`}     color="purple" />
                <StatCard icon={CheckCircle}    label="Paid Orders"      value={paidCount}                     sub="from current page"                    color="emerald" />
                <StatCard icon={Clock}          label="Pending Payment"  value={pendingCount}                  sub="awaiting payment"                     color="amber" />
                <StatCard icon={Package}        label="Delivered"        value={deliveredCount}                sub="fulfilled orders"                     color="cyan" />
            </div>

            {/* Filters */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer name..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 transition-all"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                    />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <select
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none w-full lg:w-44"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                    >
                        <option value="">All Order Status</option>
                        <option value="draft">Draft</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none w-full lg:w-44"
                        value={filters.paymentStatus}
                        onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value, page: 1 }))}
                    >
                        <option value="">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="partial">Partial</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all shrink-0"
                        title="Clear filters"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/30 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-6 py-4">Order #</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {isLoading || isFetching ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array.from({ length: 9 }).map((_, j) => (
                                            <td key={j} className="px-6 py-5">
                                                <div className="h-3 bg-slate-800 rounded-full w-full" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : orders.length > 0 ? (
                                orders.map((order, idx) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <span className="text-purple-400 font-black text-xs tracking-wide font-mono">{order.orderNumber}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-white text-sm font-bold">{order.customer?.name || 'Guest'}</p>
                                            <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">{order.customer?.email || '—'}</p>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-slate-400 font-bold whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-300 text-sm font-bold">{order.items?.length || 0}</span>
                                            <span className="text-slate-600 text-xs ml-1">item{order.items?.length !== 1 ? 's' : ''}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-white font-black text-sm tabular-nums">{formatCurrency(order.total)}</p>
                                            {order.dueAmount > 0 && (
                                                <p className="text-amber-400 text-[10px] font-bold mt-0.5">Due: {formatCurrency(order.dueAmount)}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <PaymentBadge status={order.paymentStatus} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <OrderStatusBadge status={order.orderStatus} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                {order.paymentMethod?.replace('_', ' ') || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => navigate(`/sales-order/${order._id}`)}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center">
                                                <TrendingUp className="w-7 h-7 text-slate-600" />
                                            </div>
                                            <p className="text-white font-bold">No sales orders found</p>
                                            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-800/20 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        Page <span className="text-slate-300 font-bold">{pagination.page}</span> of{' '}
                        <span className="text-slate-300 font-bold">{pagination.pages}</span>{' '}
                        · <span className="text-slate-300 font-bold">{pagination.total}</span> total orders
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page <= 1}
                            className={clsx(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all',
                                pagination.page <= 1
                                    ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Prev
                        </button>
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= pagination.pages}
                            className={clsx(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all',
                                pagination.page >= pagination.pages
                                    ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            Next <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SalesOrders;
