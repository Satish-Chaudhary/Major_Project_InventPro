import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Printer, Download, Package, 
    Calendar, User, CreditCard, ChevronRight,
    MapPin, Clock, CheckCircle2, AlertCircle, 
    Truck, DollarSign, FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
    useGetOrderByIdQuery, 
    useUpdateOrderStatusMutation,
    useGenerateInvoiceQuery 
} from '../redux/slices/orderSlice';

import { serverUrl } from '../config/api';
import { toast } from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { data: orderData, isLoading, error } = useGetOrderByIdQuery(id);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const order = orderData?.order;

    const updateOrderStatus = async (newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error(error.data?.message || "Failed to update status");
        }
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

    const getStatusTheme = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return { color: 'emerald', icon: <CheckCircle2 className="w-5 h-5" /> };
            case 'processing': return { color: 'cyan', icon: <Truck className="w-5 h-5" /> };
            case 'pending': return { color: 'amber', icon: <Clock className="w-5 h-5" /> };
            case 'cancelled': return { color: 'red', icon: <AlertCircle className="w-5 h-5" /> };
            default: return { color: 'slate', icon: <FileText className="w-5 h-5" /> };
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        navigate('/orders');
        return null;
    }

    const handlePrintInvoice = async () => {
        try {
            // Using direct fetch for blob as generateInvoice query might be overkill if not cached.
            // But we have it in RTK Query, let's use it or just axios.
            const response = await fetch(`${serverUrl}/api/orders/invoice/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice-${order.orderId || id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to generate invoice");
        }
    };

    const theme = getStatusTheme(order?.status);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-7xl mx-auto space-y-8"
        >
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button 
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Orders
                </button>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handlePrintInvoice}
                        className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-widest shadow-lg"
                    >
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                    <button 
                        onClick={handlePrintInvoice}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Summary Card */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                        <div className={clsx("absolute top-0 right-0 w-32 h-32 opacity-5 blur-3xl rounded-full translate-x-12 -translate-y-12", `bg-${theme.color}-500`)} />
                        
                        <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
                            <div className="space-y-1">
                                <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border mb-4 inline-flex items-center gap-2", 
                                    order?.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    order?.status === 'processing' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                    order?.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                )}>
                                    {theme.icon}
                                    {order?.status}
                                </span>
                                <h1 className="text-4xl font-black text-white tracking-tight">Order #{order?.orderId || order?._id?.slice(-6).toUpperCase()}</h1>
                                <p className="text-slate-500 font-bold text-sm">Placed on {order?.date} at {order?.time}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Grand Total</p>
                                <p className="text-4xl font-black text-white tabular-nums">${order?.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Order Timeline Visual */}
                        <div className="mt-12 pt-12 border-t border-slate-800/50">
                            <div className="flex items-center justify-between relative">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                                <div className={clsx("absolute top-1/2 left-0 h-0.5 -translate-y-1/2 z-0 transition-all duration-1000", 
                                    order?.status === 'pending' ? 'w-0' : 
                                    order?.status === 'processing' ? 'w-1/2' : 
                                    order?.status === 'completed' ? 'w-full' : 'w-0',
                                    `bg-${theme.color}-500/50 shadow-[0_0_8px_rgba(var(--${theme.color}),0.5)]`
                                )} />
                                {[
                                    { label: 'Pending', status: 'pending', date: order?.date },
                                    { label: 'Processing', status: 'processing', date: order?.status !== 'pending' ? 'Today' : '--' },
                                    { label: 'Completed', status: 'completed', date: order?.status === 'completed' ? 'Today' : '--' }
                                ].map((step, idx) => {
                                    const isReached = order?.status === step.status || 
                                        (order?.status === 'processing' && step.status === 'pending') ||
                                        (order?.status === 'completed');
                                    const isActive = order?.status === step.status;
                                    
                                    return (
                                        <div key={step.label} className="flex flex-col items-center gap-3 relative z-10">
                                            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500", 
                                                isReached ? `bg-slate-900 border-${theme.color}-500 shadow-[0_0_15px_rgba(var(--${theme.color}),0.3)]` : "bg-slate-950 border-slate-800 text-slate-700",
                                                isActive && "ring-4 ring-purple-500/20 scale-110"
                                            )}>
                                                {isReached ? <CheckCircle2 className={clsx("w-5 h-5", `text-${theme.color}-400`)} /> : <Clock className="w-5 h-5" />}
                                            </div>
                                            <div className="text-center">
                                                <p className={clsx("text-xs font-black uppercase tracking-widest", isReached ? "text-white" : "text-slate-600")}>{step.label}</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{step.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                <Package className="w-5 h-5 text-purple-400" />
                                Order Items
                            </h3>
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                {order?.items?.length || 0} Total Items
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                        <th className="px-8 py-5">Product Details</th>
                                        <th className="px-8 py-5">Quantity</th>
                                        <th className="px-8 py-5">Unit Price</th>
                                        <th className="px-8 py-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {order?.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700/50 group-hover:scale-105 transition-transform">
                                                        <Package className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm tracking-tight">{item.name}</p>
                                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">SKU: {item.sku || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-slate-300 font-bold tabular-nums">× {item.quantity}</td>
                                            <td className="px-8 py-6 text-sm text-slate-300 font-bold tabular-nums">${item.price?.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-sm text-white font-black text-right tabular-nums">${(item.quantity * item.price)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-800/10">
                                        <td colSpan="3" className="px-8 py-6 text-right text-slate-400 font-bold text-sm tracking-tight">Grand Total</td>
                                        <td className="px-8 py-6 text-right text-white font-black text-xl tabular-nums">${order?.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer/Supplier & Meta */}
                <div className="space-y-8">
                    {/* Activity Box */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
                        <h3 className="text-md font-bold text-white uppercase tracking-widest text-xs flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            Manage Status
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {['Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateOrderStatus(status.toLowerCase())}
                                    disabled={order?.status?.toLowerCase() === status.toLowerCase()}
                                    className={clsx(
                                        "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                                        order?.status?.toLowerCase() === status.toLowerCase()
                                            ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/50 hover:bg-purple-500/5 active:scale-[0.98]"
                                    )}
                                >
                                    {order?.status?.toLowerCase() === status.toLowerCase() && <CheckCircle2 className="w-4 h-4" />}
                                    Mark as {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Entity Info Box */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full" />
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    {order?.type?.toLowerCase() === 'inward' ? <Warehouse className="w-5 h-5 text-purple-400" /> : <User className="w-5 h-5 text-purple-400" />}
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{order?.type?.toLowerCase() === 'inward' ? 'Supplier' : 'Customer'}</p>
                                    <h3 className="text-lg font-black text-white tracking-tight">{order?.entity}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MapPin className="w-4 h-4" />
                                    <p className="text-xs font-bold">{order?.warehouse || 'Main Distribution Center'}</p>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <CreditCard className="w-4 h-4" />
                                    <p className="text-xs font-bold">Standard Payment Terms</p>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <FileText className="w-4 h-4" />
                                    <p className="text-xs font-bold">Ref: {order?.referenceNumber || 'ORD-2024-X42'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-800/50 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Order Type</span>
                                <span className={clsx("font-black uppercase tracking-widest", order?.type?.toLowerCase() === 'inward' ? 'text-emerald-400' : 'text-amber-400')}>
                                    {order?.type}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Tax Rate</span>
                                <span className="text-white font-black tabular-nums">0.00%</span>
                            </div>
                        </div>
                    </div>

                    {/* Support Box */}
                    <div className="bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 text-center shadow-lg shadow-indigo-500/10 group cursor-pointer hover:brightness-110 transition-all">
                        <Truck className="w-8 h-8 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Stock Impact</h4>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">
                            {order?.type?.toLowerCase() === 'inward' 
                                ? 'Successful completion will increment warehouse stock levels.' 
                                : 'Stock is auto-reserved and deducted upon order processing.'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetails;
