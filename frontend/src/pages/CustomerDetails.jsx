import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Mail, Phone, MapPin,
    Calendar, Package, DollarSign, ExternalLink,
    Building, Briefcase, Activity, Clock, TrendingUp
} from 'lucide-react';
import { useGetCustomerByIdQuery } from '../redux/slices/customerSlice';
import { clsx } from 'clsx';

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetCustomerByIdQuery(id);

    if (isLoading) return <div className="p-8 text-center text-slate-500 font-black uppercase tracking-widest animate-pulse">Decrypting Customer History...</div>;

    const customer = data?.customer;
    const orders = data?.orders || [];

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-7xl mx-auto space-y-8"
        >
            {/* Header / Back */}
            <div className="flex items-center justify-between no-print">
                <button
                    onClick={() => navigate('/customers')}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Registry
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/edit-customer/${id}`)}
                        className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                    >
                        Modify Profile
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-linear-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-purple-500/20"
                    >
                        Export Log
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

                        <div className="relative text-center">
                            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-slate-800 to-slate-950 border-2 border-slate-800 mx-auto flex items-center justify-center shadow-2xl mb-6">
                                <Activity className="w-10 h-10 text-purple-400" />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tighter">{customer?.name}</h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{customer?.customerNumber}</p>

                            <div className="mt-4 flex justify-center">
                                <span className={clsx(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                                    customer?.customerType === 'business' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                )}>
                                    {customer?.customerType}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4 pt-8 border-t border-slate-800/50">
                            <div className="flex items-center gap-4 group/item">
                                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 group-hover/item:border-purple-500/50 transition-colors">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Email Endpoint</p>
                                    <p className="text-sm text-slate-300 font-bold">{customer?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group/item">
                                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 group-hover/item:border-cyan-500/50 transition-colors">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Direct Line</p>
                                    <p className="text-sm text-slate-300 font-bold">{customer?.phone}</p>
                                </div>
                            </div>
                            {customer?.companyName && (
                                <div className="flex items-center gap-4 group/item">
                                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 group-hover/item:border-amber-500/50 transition-colors">
                                        <Building className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Organization</p>
                                        <p className="text-sm text-slate-300 font-bold">{customer?.companyName}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-2rem p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            Geo Logistics
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2">Billing HQ</p>
                                <p className="text-xs text-slate-300 leading-relaxed font-bold italic">
                                    {customer?.billingAddress?.street},<br />
                                    {customer?.billingAddress?.city}, {customer?.billingAddress?.state} {customer?.billingAddress?.postalCode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History & Stats */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Activity Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Revenue', value: formatCurrency(customer?.totalSpent || 0), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                            { label: 'Orders Placed', value: orders.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                            { label: 'Avg Order', value: formatCurrency((customer?.totalSpent || 0) / (orders.length || 1)), icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                    <h4 className="text-xl font-black text-white mt-1 tabular-nums">{stat.value}</h4>
                                </div>
                                <div className={clsx("p-3 rounded-xl", stat.bg)}>
                                    <stat.icon className={clsx("w-5 h-5", stat.color)} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order History Table */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-slate-800 bg-slate-800/10 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Clock className="w-4 h-4 text-purple-400" />
                                Transaction History
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.2em] border-b border-slate-800">
                                        <th className="px-8 py-4">Order ID</th>
                                        <th className="px-8 py-4">Date</th>
                                        <th className="px-8 py-4">Amount</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">View</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 text-center text-slate-500 italic text-sm">No transaction markers recorded yet.</td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-8 py-5 text-sm font-black text-white">{order.orderNumber}</td>
                                                <td className="px-8 py-5 text-xs text-slate-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="px-8 py-5 text-sm font-black text-white tabular-nums">{formatCurrency(order.total)}</td>
                                                <td className="px-8 py-5">
                                                    <span className={clsx(
                                                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border",
                                                        order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            order.orderStatus === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    )}>
                                                        {order.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => navigate(`/sales-order/${order._id}`)}
                                                        className="p-2 text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CustomerDetails;
