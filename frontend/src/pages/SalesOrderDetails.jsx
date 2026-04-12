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

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

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
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 15mm; size: auto; }
                    body { background: white !important; color: black !important; }
                    .print-only { display: block !important; }
                    .no-print { display: none !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; text-shadow: none !important; }
                    .bg-slate-900\\/40, .bg-slate-950, .bg-slate-800, .bg-slate-800\\/10 { background: transparent !important; border: 1px solid #eee !important; }
                    .text-white, .text-slate-300, .text-slate-400 { color: black !important; }
                    .text-purple-400, .text-cyan-400, .text-indigo-400 { color: #1e3a8a !important; }
                    .border-slate-800, .border-slate-700 { border-color: #ddd !important; }
                    h1, h2, h3, h4 { color: black !important; font-weight: 900 !important; }
                    table { border-collapse: collapse !important; border: 1px solid #eee !important; }
                    th { border-bottom: 2px solid black !important; color: black !important; }
                    td { border-bottom: 1px solid #eee !important; }
                }
            `}} />
            {/* Print Only Header */}
            <div className="print-only mb-10 border-b-2 border-blue-900 pb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-4xl font-black text-blue-900 tracking-tighter">INVENTPRO</h2>
                        <p className="text-sm text-gray-700 font-bold mt-1 uppercase tracking-widest">Enterprise Inventory Solutions</p>
                        <div className="mt-6 space-y-1">
                            <p className="text-xs text-gray-600 font-medium leading-relaxed flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                123 Business Avenue, Tech Park, Hyderabad, India
                            </p>
                            <p className="text-xs text-gray-600 font-medium flex items-center gap-2">
                                <Send className="w-3 h-3" />
                                support@inventpro.com | +91 98765 43210
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="text-2xl font-black text-blue-900 uppercase tracking-widest">Tax Invoice</h3>
                            <p className="text-[10px] text-blue-700 font-black mt-1 uppercase">Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
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
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl print:border-none print:p-0 print:shadow-none">
                        <div className="flex flex-wrap items-start justify-between gap-6 relative z-10">
                            <div className="space-y-1">
                                <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border mb-4 inline-flex items-center gap-2 no-print", 
                                    order.orderStatus === 'confirmed' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                    order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                )}>
                                    <Clock className="w-3 h-3" />
                                    {order.orderStatus}
                                </span>
                                <p className="print:block hidden text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Receipt for Order</p>
                                <h1 className="text-4xl font-black text-white tracking-tight print:text-black print:text-5xl">{order.orderNumber}</h1>
                                <p className="text-slate-500 font-bold text-sm print:text-gray-700 print:mt-2">Customer: {order.customer?.name || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1 print:text-gray-500">Order Value</p>
                                <p className="text-4xl font-black text-white tabular-nums print:text-black">{formatCurrency(order.total)}</p>
                                <span className={clsx("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border mt-2 inline-block print:border-blue-200 print:bg-blue-50 print:text-blue-700", 
                                    order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                )}>{order.paymentStatus}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/50 print:border-gray-200">
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest print:text-gray-500">Payment Status</p>
                                <p className="text-white text-xs font-bold uppercase print:text-black">{order.paymentStatus}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest print:text-gray-500">Transaction ID</p>
                                <p className="text-white text-[10px] font-mono truncate print:text-black">{order.transactionId || 'INTERNAL'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest print:text-gray-500">Gateway</p>
                                <p className="text-white text-xs font-bold uppercase print:text-black">{order.paymentGateway}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest print:text-gray-500">Placement Date</p>
                                <p className="text-white text-xs font-bold print:text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl print:bg-white print:border-none print:shadow-none">
                        <div className="px-8 py-5 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between no-print">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Package className="w-4 h-4 text-purple-400" />
                                Order Manifest
                            </h3>
                        </div>
                        <table className="w-full text-left print:mt-8">
                            <thead>
                                <tr className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] border-b border-slate-800 print:text-gray-500 print:border-gray-200">
                                    <th className="px-8 py-4">Item Details</th>
                                    <th className="px-8 py-4">Quantity</th>
                                    <th className="px-8 py-4">Price</th>
                                    <th className="px-8 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                                {order.items?.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="text-white text-sm font-bold print:text-black">{item.productName}</p>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase print:text-gray-500">{item.sku}</p>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-300 font-bold tabular-nums print:text-black">{item.quantity} Units</td>
                                        <td className="px-8 py-5 text-sm text-slate-300 font-bold tabular-nums print:text-black">{formatCurrency(item.unitPrice)}</td>
                                        <td className="px-8 py-5 text-sm text-white font-black text-right tabular-nums print:text-black">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                            {/* Payment Breakdown */}
                            <div className="px-8 py-6 border-t border-slate-800 bg-slate-800/10 space-y-2 print:bg-white print:border-gray-100 print:mt-12 print:ml-auto print:max-w-md">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-medium print:text-gray-600">Subtotal</span>
                                    <span className="text-slate-300 font-bold tabular-nums print:text-black">{formatCurrency(order.subtotal)}</span>
                                </div>
                                {order.discountTotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium print:text-gray-600">Applied Discount</span>
                                        <span className="text-emerald-400 font-bold tabular-nums print:text-emerald-600">- {formatCurrency(order.discountTotal)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-medium print:text-gray-600">Tax (GST)</span>
                                    <span className="text-slate-300 font-bold tabular-nums print:text-black">{formatCurrency(order.taxAmount)}</span>
                                </div>
                                <div className="flex justify-between text-base pt-3 mt-2 border-t border-slate-700 print:border-blue-900">
                                    <span className="text-white font-black uppercase tracking-wide print:text-blue-900">Grand Total</span>
                                    <span className="text-white font-black tabular-nums print:text-blue-900 print:text-2xl">{formatCurrency(order.total)}</span>
                                </div>
                                {order.paidAmount > 0 && (
                                    <div className="flex justify-between text-sm pt-2">
                                        <span className="text-emerald-400 font-medium print:text-green-700 underline underline-offset-4 decoration-green-200">Amount Paid</span>
                                        <span className="text-emerald-400 font-bold tabular-nums print:text-green-700">{formatCurrency(order.paidAmount)}</span>
                                    </div>
                                )}
                            </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl no-print">
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

                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl print:border-none print:p-0 print:shadow-none print:mt-12">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest print:text-blue-900 print:border-b print:pb-2">Billed To</h3>
                        <div className="print:mt-4">
                            <p className="text-white font-black text-lg tracking-tight print:text-black">{order.customer?.name}</p>
                            <p className="text-slate-500 text-xs font-medium print:text-gray-700">{order.customer?.email}</p>
                            <p className="text-slate-500 text-xs font-medium mt-1 print:text-gray-700">{order.customer?.phoneNumber || 'No phone provided'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <footer className="print-only print-footer mt-auto">
                <p className="font-bold text-gray-800 italic text-sm">"Thank you for your business!"</p>
                <div className="flex justify-center gap-4 mt-2">
                    <p>Computer Generated Invoice</p>
                    <p>|</p>
                    <p>Powered by InventPro</p>
                </div>
            </footer>
        </motion.div>


    );
};

export default SalesOrderDetails;
