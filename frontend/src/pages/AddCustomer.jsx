import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Mail, Phone, MapPin,
    TrendingUp, CreditCard, Save,
    ArrowLeft, Type, Building, RotateCcw
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useAddCustomerMutation,
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation
} from '../redux/slices/customerSlice';
import { toast } from 'react-hot-toast';
import { clsx } from 'clsx'

const AddCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: customerData, isLoading: fetchLoading } = useGetCustomerByIdQuery(id, { skip: !isEdit });
    const [addCustomer, { isLoading: addLoading }] = useAddCustomerMutation();
    const [updateCustomer, { isLoading: updateLoading }] = useUpdateCustomerMutation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        customerType: 'individual',
        companyName: '',
        taxId: '',
        billingAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India'
        },
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India'
        },
        notes: ''
    });

    React.useEffect(() => {
        if (customerData?.customer) {
            const customer = customerData.customer;
            setFormData(prev => ({
                ...prev,
                ...customer,
                billingAddress: {
                    ...prev.billingAddress,
                    ...(customer.billingAddress || {})
                },
                shippingAddress: {
                    ...prev.shippingAddress,
                    ...(customer.shippingAddress || {})
                }
            }));
        }
    }, [customerData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateCustomer({ id, ...formData }).unwrap();
                toast.success('Customer intelligence updated');
            } else {
                await addCustomer(formData).unwrap();
                toast.success('New customer registered');
            }
            navigate('/customers');
        } catch (err) {
            toast.error(err.data?.message || 'Protocol failure during save');
        }
    };

    if (fetchLoading) return <div className="p-8 text-white">Retrieving profile...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-6xl mx-auto space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-8">
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/customers')}
                        className="flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Registry
                    </button>
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">
                            {isEdit ? 'Refine' : 'Initialize'} <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">Intelligence</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-bold mt-2 flex items-center gap-2">
                            <span className="w-8 h-px bg-slate-800" />
                            {isEdit ? 'Synchronizing contact protocols and financial identity' : 'Establishing new personnel / organization node'}
                        </p>
                    </div>
                </div>

                {isEdit && (
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center gap-6 backdrop-blur-xl">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Orders</p>
                            <p className="text-xl font-black text-white px-4 tracking-tighter">{customerData?.customer?.totalOrders || 0}</p>
                        </div>
                        <div className="w-px h-10 bg-slate-800" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Value</p>
                            <p className="text-xl font-black text-emerald-400 px-4 tracking-tighter">${customerData?.customer?.totalSpent?.toLocaleString() || '0'}</p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
                {/* Left Column: Core Info */}
                <div className="lg:col-span-7 space-y-8">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden shadow-2xl backdrop-blur-3xl group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none" />

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">Identity Hub</h3>
                                <p className="text-slate-500 text-xs font-bold tracking-widest">PRIMARY CONTACT ENCRYPTION</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Label</label>
                                <div className="relative group/field">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within/field:text-purple-400" />
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-950/60 border border-slate-800 p-4 pl-12 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                                        placeholder="Full Name..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Entity Classification</label>
                                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                                    {['individual', 'business'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, customerType: type })}
                                            className={clsx(
                                                "py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2",
                                                formData.customerType === type
                                                    ? "bg-purple-500 text-white shadow-xl shadow-purple-500/20"
                                                    : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            {type === 'business' ? <Building className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Communication Endpoint</label>
                                <div className="relative group/field">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/field:text-cyan-400" />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-950/60 border border-slate-800 p-4 pl-12 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
                                        placeholder="email@organization.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Direct Patch (Phone)</label>
                                <div className="relative group/field">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/field:text-emerald-400" />
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-950/60 border border-slate-800 p-4 pl-12 rounded-2xl text-white font-bold placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                        placeholder="+X-XXXX-XXXXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.customerType === 'business' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800/50"
                            >
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Corporate Moniker</label>
                                    <input
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-white font-bold focus:border-purple-500/50 outline-none transition-all"
                                        placeholder="Organization name..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Fiscal Registry (GST/TAX)</label>
                                    <input
                                        value={formData.taxId}
                                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                        className="w-full bg-slate-950/60 border border-slate-800 p-4 rounded-2xl text-white font-bold focus:border-cyan-500/50 outline-none transition-all"
                                        placeholder="Tax credentials..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </section>

                    <section className="bg-slate-900/10 border border-slate-800/60 rounded-[2.5rem] p-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Intelligence Notes</h3>
                        </div>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            className="w-full bg-slate-950/60 border border-slate-800 p-6 rounded-3xl text-sm text-slate-300 font-medium placeholder:text-slate-800 focus:border-amber-500/50 outline-none transition-all resize-none"
                            placeholder="Record behavioral patterns, specific requirements, or interaction history..."
                        />
                    </section>
                </div>

                {/* Right Column: Logistics */}
                <div className="lg:col-span-5 space-y-8">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative group">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                    <MapPin className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">Logistics Matrix</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, shippingAddress: { ...formData.billingAddress } })}
                                className="text-[10px] font-black text-cyan-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Sync Nodes
                            </button>
                        </div>

                        {/* Billing */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Billing HQ</h4>
                            </div>
                            <div className="space-y-4">
                                <input
                                    value={formData.billingAddress?.street || ''}
                                    onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, street: e.target.value } })}
                                    className="w-full bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm text-white font-bold focus:border-cyan-500/50 outline-none"
                                    placeholder="Street / Unit"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={formData.billingAddress?.city || ''}
                                        onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, city: e.target.value } })}
                                        className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm text-white font-bold outline-none"
                                        placeholder="City"
                                    />
                                    <input
                                        value={formData.billingAddress?.postalCode || ''}
                                        onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, postalCode: e.target.value } })}
                                        className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm text-white font-bold outline-none"
                                        placeholder="Post-Code"
                                    />
                                </div>
                            </div>
                        </div>
 
                        {/* Shipping */}
                        <div className="space-y-6 pt-6 border-t border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Drop-Off Terminal</h4>
                            </div>
                            <div className="space-y-4">
                                <input
                                    value={formData.shippingAddress?.street || ''}
                                    onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, street: e.target.value } })}
                                    className="w-full bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm text-white font-bold focus:border-emerald-500/50 outline-none"
                                    placeholder="Delivery Street"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={formData.shippingAddress?.city || ''}
                                        onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, city: e.target.value } })}
                                        className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm text-white font-bold outline-none"
                                        placeholder="City"
                                    />
                                    <input
                                        value={formData.shippingAddress?.postalCode || ''}
                                        onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value } })}
                                        className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm text-white font-bold outline-none"
                                        placeholder="Zip-Track"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center z-50 pointer-events-none">
                    <div className="bg-slate-950/90 backdrop-blur-2xl border border-slate-800 p-2 rounded-4xl flex items-center gap-2 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
                        <button
                            type="button"
                            onClick={() => navigate('/customers')}
                            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={addLoading || updateLoading}
                            className="flex items-center gap-10 bg-linear-to-r from-purple-600 to-cyan-600 text-white pl-12 pr-4 py-4 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:brightness-125 transition-all shadow-xl shadow-purple-500/20 active:scale-95 disabled:grayscale group"
                        >
                            {(addLoading || updateLoading) ? 'PROCESSSING...' : 'Synchronize Profile'}
                            <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                <Save className="w-4 h-4" />
                            </div>
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default AddCustomer;
