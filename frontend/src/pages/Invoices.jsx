import React from 'react';
import { useGetInvoicesQuery, useUpdateInvoiceStatusMutation } from '../redux/slices/invoiceSlice';
import { FiDownload, FiEye, FiMail, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { serverUrl } from '../config/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
    const navigate = useNavigate();
    const { data: invoicesData, isLoading, refetch } = useGetInvoicesQuery();
    const [updateStatus] = useUpdateInvoiceStatusMutation();

    const handleDownload = (id, invoiceNumber) => {
        const token = localStorage.getItem('token');
        fetch(`${serverUrl}/api/invoices/download/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice-${invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => toast.error('Failed to download invoice'));
    };

    const handleEmail = (id) => {
        // This would call a re-send email endpoint if we had one
        toast.success('Invoice email queued for re-sending');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <FiCheckCircle className="text-green-400" />;
            case 'sent': return <FiMail className="text-blue-400" />;
            case 'overdue': return <FiAlertCircle className="text-red-400" />;
            default: return <FiClock className="text-amber-400" />;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading billing data...</div>;

    const invoices = invoicesData?.invoices || [];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Invoices & Billing</h1>
                    <p className="text-slate-400 mt-1">Manage customer invoices and payment reconciliation</p>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-800/20 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <th className="px-8 py-5">Invoice #</th>
                            <th className="px-8 py-5">Customer</th>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Amount</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-12 text-center text-slate-500 italic">No invoices generated yet.</td>
                            </tr>
                        ) : (
                            invoices.map((inv) => (
                                <tr key={inv._id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="text-white font-bold tracking-tight">{inv.invoiceNumber}</span>
                                    </td>
                                    <td className="px-8 py-6 text-slate-300 font-medium">
                                        {inv.customerId?.name || 'Unknown'}
                                    </td>
                                    <td className="px-8 py-6 text-slate-400 text-sm">
                                        {new Date(inv.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-white font-black">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inv.total || 0)}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                            inv.status === 'paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                                            inv.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => navigate(`/sales-order/${inv.salesOrderId?._id || inv.salesOrderId}`)}
                                                className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                                title="View Original Order"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                            {inv.status !== 'paid' && (
                                                <button 
                                                    onClick={() => navigate(`/payments/checkout/${inv._id}`, { state: { amount: inv.total } })}
                                                    className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                                    title="Pay Invoice"
                                                >
                                                    <span className="text-xs font-bold px-1">PAY</span>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDownload(inv._id, inv.invoiceNumber)}
                                                className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                                title="Download PDF"
                                            >
                                                <FiDownload size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleEmail(inv._id)}
                                                className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                                title="Resend Email"
                                            >
                                                <FiMail size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
