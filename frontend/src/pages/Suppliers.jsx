import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Mail, Phone, Edit3, Trash2,
    Search, Shield, CheckCircle2, MoreVertical,
    MapPin, Clock, ArrowUpRight, Download, ChevronRight, Filter
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import {
    useGetVendorsQuery,
    useDeleteVendorMutation
} from '../redux/slices/vendorSlice';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { toast } from 'react-hot-toast';
import { exportToCSV } from '../utils/exportUtils';

const Suppliers = () => {
    const navigate = useNavigate();
    const { data: vendorsData, isLoading, error } = useGetVendorsQuery();
    const [deleteVendor] = useDeleteVendorMutation();
    const confirmDelete = useDeleteWithConfirm();

    // API returns { success: true, suppliers: [...] }
    const suppliers = vendorsData?.suppliers || [];
    const isEmpty = suppliers.length === 0 && !isLoading;

    // Debug
    console.log('Suppliers page:', { vendorsData, suppliers, isLoading, error });
    const [activeSuppliersTab, setActiveSuppliersTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredSuppliers = suppliers.filter(sup => {
        const supplierStatus = sup.status?.toLowerCase() || 'inactive';
        const matchesTab = activeSuppliersTab === 'all' || supplierStatus === activeSuppliersTab.toLowerCase();
        const matchesSearch =
            sup.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sup.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sup.email?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const handleDelete = async (id) => {
        const supplier = suppliers.find(s => s._id === id);
        confirmDelete({
            title: `Supplier: ${supplier?.company || id}`,
            onConfirm: async () => {
                await deleteVendor(id);
                toast.success('Supplier removed successfully');
            }
        });
    };

    const handleEdit = (supplier) => {
        navigate('/add-supplier', { state: { supplier } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 space-y-6 max-w-7xl mx-auto"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Suppliers</h2>
                    <p className="text-slate-400 text-xs font-medium mt-1">Manage your global vendor network</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => {
                            const exportData = suppliers.map(s => ({
                                Company: s.company,
                                Code: s.code,
                                Contact: s.contact,
                                Email: s.email,
                                Phone: s.phone,
                                Location: s.location || 'N/A',
                                Status: s.status
                            }));
                            exportToCSV(exportData, `suppliers_report_${new Date().toLocaleDateString()}`);
                        }}
                        className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-all text-xs font-bold uppercase tracking-widest shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => navigate('/add-supplier')}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:brightness-110 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-500/20"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New Supplier
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-800 px-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
                {['all', 'active', 'inactive'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveSuppliersTab(tab)}
                        className={clsx(
                            "py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                            activeSuppliersTab === tab ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        {tab} Vendors
                        {activeSuppliersTab === tab && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
                <div className="md:col-span-2 relative group uppercase text-[10px] font-black text-slate-500 tracking-[0.2em]">
                    <Search className="absolute left-4 top-[50%] -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by company, code or email..."
                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select
                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold text-slate-400 focus:outline-none appearance-none cursor-pointer hover:border-slate-700 transition-all uppercase tracking-widest"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Infrastructure</option>
                        <option>Logistics</option>
                    </select>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl px-6 py-4 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Total Results</span>
                    <span className="text-white font-black tabular-nums">{filteredSuppliers.length}</span>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading suppliers...</p>
                    </div>
                ) : isEmpty || error ? (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                            <Users className="w-8 h-8 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                {error ? 'Error loading suppliers' : 'No vendors found'}
                            </p>
                            {error && <p className="text-red-400 text-xs mt-2">{error.message}</p>}
                        </div>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                <th className="px-8 py-6">Company & ID</th>
                                <th className="px-8 py-6">Primary Contact</th>
                                <th className="px-8 py-6">Email & Phone</th>
                                <th className="px-8 py-6">Location</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <AnimatePresence>
                                {filteredSuppliers.map((sup) => (
                                    <motion.tr
                                        key={sup._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 transition-all shadow-lg">
                                                    <Shield className="w-6 h-6 text-slate-500 group-hover:text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-sm tracking-tight">{sup.company}</p>
                                                    <p className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest mt-0.5">{sup.code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-linear-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-[11px] font-black text-white uppercase shadow-md">
                                                    {sup.contact?.charAt(0)}
                                                </div>
                                                <p className="text-slate-300 text-sm font-bold tracking-tight">{sup.contact}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="space-y-1.5">
                                                <p className="text-white text-xs font-bold tracking-tight flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                                                    {sup.email}
                                                </p>
                                                <p className="text-slate-500 text-[10px] flex items-center gap-2 font-black tabular-nums">
                                                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                                                    {sup.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-xs font-bold tracking-tight">{sup.location || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                sup.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800/10 text-slate-500 border-slate-800"
                                            )}>
                                                {sup.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="flex items-center justify-end gap-1 px-2">
                                                <button
                                                    onClick={() => handleEdit(sup)}
                                                    className="p-2.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all"
                                                    title="Edit Record"
                                                >
                                                    <Edit3 className="w-4.5 h-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sup._id)}
                                                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                    title="Remove Supplier"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>
            {filteredSuppliers.length === 0 && !isLoading && (
                <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No vendors found matching search</p>
                    </div>
                </div>
            )}
        </motion.div >
        // </div>
    );
};

export default Suppliers;
