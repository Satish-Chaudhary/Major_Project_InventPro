import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, ShieldCheck, ShieldAlert, Lock,
    Key, Users, UserPlus, Search,
    Edit2, Trash2, Plus, ArrowRight,
    Server, Activity, Globe, Zap,
    Settings, Package, MoreVertical, FolderPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { clsx } from 'clsx';
const AdminRoles = () => {
    const navigate = useNavigate();
    const { allRoles, deleteRole } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            deleteRole(id);
            setActiveMenu(null);
        }
    };

    const filteredRoles = allRoles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 space-y-8"
        >
            {/* Header - Matching Categories.jsx */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Security Roles</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage system-wide permissions and clearance archetypes.</p>
                </div>
                <button
                    onClick={() => navigate('/add-role')}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-lg shadow-purple-500/20"
                >
                    <FolderPlus className="w-4 h-4" />
                    Deploy New Role
                </button>
            </div>

            {/* Grid - Matching Categories.jsx */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role, index) => (
                    <motion.div
                        key={role._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                <Shield className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="relative">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenu(activeMenu === role._id ? null : role._id);
                                    }}
                                    className="p-2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                                {activeMenu === role._id && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-20 py-2"
                                    >
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/add-role', { state: { editRole: role } });
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-xs font-bold"
                                        >
                                            <Edit2 className="w-4 h-4 text-cyan-400" />
                                            Edit Architecture
                                        </button>
                                        <div className="h-px bg-slate-800 my-1 mx-2"></div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(role._id);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Decommission
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white tracking-tight">{role.name}</h3>
                        <p className="text-slate-500 text-xs mt-2 line-clamp-2 h-8">{role.description || 'No description provided.'}</p>

                        <div className="flex items-center gap-4 mt-6">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Permissions</p>
                                <p className="text-white font-bold text-lg">{role.permissions.length}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">Security Level</p>
                                <p className="text-purple-400 font-bold text-lg">High</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Extra Section: Security Hardening (Integrated into the matching layout) */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mt-8">
                <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-purple-400" />
                    Security Baseline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {[
                        { label: 'Global MFA', value: 'Enforced', color: 'text-emerald-400' },
                        { label: 'Session Timeout', value: '15m', color: 'text-purple-400' },
                        { label: 'IP Whitelisting', value: 'Active', color: 'text-cyan-400' },
                        { label: 'Audit Logging', value: '90 Days', color: 'text-amber-400' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-slate-800/20 rounded-xl border border-transparent hover:border-slate-700/50 transition-all">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                            <p className={clsx("text-sm font-bold mt-1", item.color)}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminRoles;
