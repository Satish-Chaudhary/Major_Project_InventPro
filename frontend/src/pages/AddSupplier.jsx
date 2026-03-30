import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, X, Upload, Check,
    ChevronRight, Building2, Info, Mail, Phone, User, Globe, FileText, MapPin, Tag
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetCategoriesQuery } from '../redux/slices/categorySlice';
import { 
    useCreateVendorMutation, 
    useUpdateVendorMutation 
} from '../redux/slices/vendorSlice';
import { toast } from 'react-hot-toast';

const AddSupplier = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: categoriesData } = useGetCategoriesQuery();
    const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
    const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
    
    const categories = categoriesData?.categories || [];
    const editData = location.state?.supplier;
    const isEdit = !!editData;

    const [formData, setFormData] = useState({
        company: '',
        code: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
        contact: '',
        email: '',
        phone: '',
        categories: [],
        location: '',
        status: 'Active'
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                company: editData.company || '',
                code: editData.code || '',
                contact: editData.contact || '',
                email: editData.email || '',
                phone: editData.phone || '',
                categories: editData.categories?.map(c => typeof c === 'string' ? c : c._id) || [],
                location: editData.location || '',
                status: editData.status || 'Active'
            });
        }
    }, [editData]);

    const handleSave = async () => {
        if (!formData.company || !formData.email || !formData.phone) {
            toast.error("Please fill in required fields (*)");
            return;
        }

        try {
            if (isEdit) {
                await updateVendor({ id: editData._id, ...formData }).unwrap();
                toast.success('Supplier profile updated');
            } else {
                await createVendor(formData).unwrap();
                toast.success('Supplier registered successfully');
            }
            navigate('/suppliers');
        } catch (error) {
            toast.error(error.data?.message || 'Failed to save supplier');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 max-w-5xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        {isEdit ? 'Edit Supplier Profile' : 'Register New Supplier'}
                    </h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Vendor Network</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/suppliers')}
                        className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isCreating || isUpdating}
                        className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        {(isCreating || isUpdating) ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        {isEdit ? (isUpdating ? 'Updating...' : 'Update Supplier') : (isCreating ? 'Saving...' : 'Save Supplier')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
                            <h3 className="text-xl font-bold text-white tracking-tight">Company Details</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Company Name *</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Enter company legal name"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Supplier Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    readOnly
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-slate-500 text-xs font-mono font-bold uppercase cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Headquarters Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="e.g. New York, USA"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-cyan-500 rounded-full" />
                            <h3 className="text-xl font-bold text-white tracking-tight">Contact Person</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Primary Rep Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Representative Name"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address *</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="vendor@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Phone Number *</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Side Panel: Metadata & Status */}
                <div className="space-y-8">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Business Scope
                        </h3>

                        <div className="space-y-2">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Target Categories</label>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                {categories.slice(0, 6).map(cat => (
                                    <label
                                        key={cat._id}
                                        className={clsx(
                                            "flex items-center justify-between p-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer",
                                            formData.categories.includes(cat._id)
                                                ? "bg-purple-500/10 border-purple-500/30 text-white"
                                                : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                                        )}
                                    >
                                        {cat.catName}
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.categories.includes(cat._id)}
                                            onChange={(e) => {
                                                const newCats = e.target.checked
                                                    ? [...formData.categories, cat._id]
                                                    : formData.categories.filter(id => id !== cat._id);
                                                setFormData({ ...formData, categories: newCats });
                                            }}
                                        />
                                        <div className={clsx("w-2 h-2 rounded-full", formData.categories.includes(cat._id) ? "bg-purple-500" : "bg-slate-800")} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Status</h3>
                        <div className="flex gap-2">
                            {['Active', 'Inactive'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFormData({ ...formData, status })}
                                    className={clsx(
                                        "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                                        formData.status === status
                                            ? status === 'Active' ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400"
                                            : "bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default AddSupplier;
