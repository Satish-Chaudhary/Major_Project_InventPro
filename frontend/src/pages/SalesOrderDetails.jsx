import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Printer, Download, Package, 
    Calendar, User, CreditCard, ChevronRight,
    MapPin, Clock, CheckCircle2, AlertCircle, 
    Truck, DollarSign, FileText, Send
} from 'lucide-react';
import { clsx } from 'clsx';
import { useGetSalesOrderByIdQuery, useUpdateOrderStatusMutation } from '../redux/slices/salesOrderSlice';
import { serverUrl } from '../config/api';
import { toast } from 'react-hot-toast';

const SalesOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { data: orderData, isLoading, error } = useGetSalesOrderByIdQuery(id);
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const order = orderData?.order;

    const handleUpdateStatus = async (newStatus) => {
        try {
            await updateStatus({ id, orderStatus: newStatus }).unwrap();
            toast.success(`Order marked as ${newStatus}`);
        } catch (err) {
            toast.error(err.data?.message || "Failed to update status");
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            // Find associated invoice
            const res = await fetch(`${serverUrl}/api/invoices/all`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            const inv = data.invoices?.find(i => i.salesOrderId?._id === id || i.salesOrderId === id);
            
            if (!inv) {
                toast.error("Invoice not generated for this order yet.");
                return;
            }

            const downloadRes = await fetch(`${serverUrl}/api/invoices/download/${inv._id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const blob = await downloadRes.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice-${inv.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Error downloading invoice");
        }
    };

    if (isLoading) return <div className="p-6 text-center text-slate-500 font-bold animate-pulse">Retrieving full transaction history...</div>;
    if (error || !order) return <div className="p-6 text-center text-red-500">Sales order not found.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-7xl mx-auto space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button 
                    onClick={() => navigate('/sales-orders')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Transactions
                </button>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDownloadInvoice}
                        className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <FileText className="w-4 h-4" />
                        Invoice
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20"
                    >
                        <Printer className="w-4 h-4" />
                        Print Order
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                        <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
                            <div className="space-y-1">
                                <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border mb-4 inline-flex items-center gap-2", 
                                    order.orderStatus === 'confirmed' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                    order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                )}>
                                    <Clock className="w-3 h-3" />
                                    {order.orderStatus}
                                </span>
                                <h1 className="text-4xl font-black text-white tracking-tight">{order.orderNumber}</h1>
                                <p className="text-slate-500 font-bold text-sm">Customer: {order.customer?.name || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Order Value</p>
                                <p className="text-4xl font-black text-white tabular-nums">${order.total?.toFixed(2)}</p>
                                <span className={clsx("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border mt-2 inline-block", 
                                    order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                )}>{order.paymentStatus}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/50">
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Payment Method</p>
                                <p className="text-white text-xs font-bold uppercase">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Transaction ID</p>
                                <p className="text-white text-[10px] font-mono truncate">{order.transactionId || 'INTERNAL'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Gateway</p>
                                <p className="text-white text-xs font-bold uppercase">{order.paymentGateway}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Placement Date</p>
                                <p className="text-white text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Package className="w-4 h-4 text-purple-400" />
                                Order Manifest
                            </h3>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] border-b border-slate-800">
                                    <th className="px-8 py-4">Item</th>
                                    <th className="px-8 py-4">Qty</th>
                                    <th className="px-8 py-4">Unit</th>
                                    <th className="px-8 py-4 text-right">Ext. Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {order.items?.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="text-white text-sm font-bold">{item.productName}</p>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase">{item.sku}</p>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-300 font-bold tabular-nums">×{item.quantity}</td>
                                        <td className="px-8 py-5 text-sm text-slate-300 font-bold tabular-nums">${item.unitPrice?.toFixed(2)}</td>
                                        <td className="px-8 py-5 text-sm text-white font-black text-right tabular-nums">${item.total?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Send className="w-3 h-3 text-cyan-400" />
                            Workflow Management
                        </h3>
                        <div className="space-y-2">
                            {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                                <button
                                    key={st}
                                    onClick={() => handleUpdateStatus(st)}
                                    disabled={order.orderStatus === st || isUpdating}
                                    className={clsx(
                                        "w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                        order.orderStatus === st 
                                            ? "bg-slate-800 border-slate-700 text-slate-500" 
                                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/50"
                                    )}
                                >
                                    {st === order.orderStatus ? 'Current Status' : `Mark as ${st}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Customer Details</h3>
                        <div>
                            <p className="text-white font-bold text-sm tracking-tight">{order.customer?.name}</p>
                            <p className="text-slate-500 text-xs font-medium">{order.customer?.email}</p>
                            <p className="text-slate-500 text-xs font-medium mt-1">{order.customer?.phoneNumber || 'No phone provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SalesOrderDetails;
