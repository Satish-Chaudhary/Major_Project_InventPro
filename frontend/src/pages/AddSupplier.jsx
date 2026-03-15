import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus, X, Upload, Check,
    ChevronRight, Building2, Info, Mail, Phone, User, Globe, FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AddSupplier = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const { addSupplier } = useApp();
    const onClose = () => navigate('/suppliers');

    const [formData, setFormData] = useState({
        companyName: '',
        supplierCode: 'SUP-029',
        website: '',
        taxId: '',
        description: '',
        contactName: '',
        position: '',
        email: '',
        phone: ''
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Add New Supplier</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                addSupplier({
                                    id: Date.now(),
                                    company: formData.companyName || 'New Supplier',
                                    code: formData.supplierCode,
                                    contact: formData.contactName || 'TBD',
                                    email: formData.email || 'n/a',
                                    phone: formData.phone || 'n/a',
                                    categories: ['General'],
                                    status: 'Active',
                                    reliability: 100,
                                    location: 'Remote'
                                });
                                onClose();
                            }}
                            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-xs uppercase tracking-widest"
                        >
                            <Check className="w-4 h-4" />
                            Save Supplier
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="space-y-10">
                        {/* Company Information Section */}
                        <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-8">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-white tracking-tight">Company Information</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">General details about the supplier company.</p>
                            </div>

                            <div className="flex gap-8 items-start">
                                {/* Logo Upload */}
                                <div className="group relative w-24 h-24 border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all shrink-0">
                                    <Upload className="w-6 h-6 text-slate-600 group-hover:text-purple-400 mb-1" />
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Logo</span>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-6">
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Company Name *</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-purple-400" />
                                            <input
                                                type="text"
                                                placeholder="e.g. Acme Corp"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Supplier Code</label>
                                        <input
                                            type="text"
                                            value={formData.supplierCode}
                                            disabled
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-500 text-sm cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-purple-400" />
                                            <input
                                                type="text"
                                                placeholder="https://"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Tax ID / VAT Number</label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-purple-400" />
                                            <input
                                                type="text"
                                                placeholder="e.g. US12345678"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Brief description of products or services provided."
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Primary Contact Section */}
                        <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-8 space-y-8">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-white tracking-tight">Primary Contact</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Direct point of contact for this supplier.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400" />
                                        <input
                                            type="text"
                                            placeholder="e.g. John Doe"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Position / Role</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sales Manager"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400" />
                                        <input
                                            type="email"
                                            placeholder="e.g. john@example.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Phone Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400" />
                                        <input
                                            type="text"
                                            placeholder="e.g. +1 (555) 000-0000"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddSupplier;
