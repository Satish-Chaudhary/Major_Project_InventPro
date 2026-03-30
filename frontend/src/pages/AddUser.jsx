import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Lock,
    Shield, Check, X, Camera,
    ShieldCheck, Briefcase, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';
import { 
    useAddUserMutation, 
    useGetRolesQuery, 
    useGetDepartmentsQuery 
} from '../redux/slices/adminSlice';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

const AddUser = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const [addUser] = useAddUserMutation();
    const { data: rolesData } = useGetRolesQuery();
    const { data: deptsData } = useGetDepartmentsQuery();

    const allRoles = rolesData?.roles || [];
    const departments = deptsData?.departments || [];

    const onClose = () => navigate('/users');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        department: '',
        status: 'active'
    });

    useEffect(() => {
        if (allRoles.length > 0 && !formData.role) {
            setFormData(prev => ({ ...prev, role: allRoles[0].name }));
        }
    }, [allRoles, formData.role]);

    useEffect(() => {
        if (departments.length > 0 && !formData.department) {
            setFormData(prev => ({ ...prev, department: departments[0].name }));
        }
    }, [departments, formData.department]);

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
                className="relative w-full max-w-6xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        {/* <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                            <span>User Management</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-slate-300">Add New User</span>
                        </div> */}
                        <h2 className="text-3xl font-bold text-white tracking-tight">Add New User</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-2xl border border-slate-700 text-slate-300 font-black uppercase tracking-widest hover:bg-slate-800 transition-all text-[10px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                if (formData.password !== formData.confirmPassword) {
                                    return toast.error("Passwords do not match");
                                }
                                try {
                                    await addUser(formData).unwrap();
                                    toast.success('User created successfully');
                                    onClose();
                                } catch (err) {
                                    toast.error(err.data?.message || 'Failed to create user');
                                }
                            }}
                            className="px-8 py-3 rounded-2xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-[10px]"
                        >
                            <Check className="w-4 h-4" />
                            Create User
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left Columns - Form Details */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Personal Details */}
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-10 space-y-10">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Personal Details</h3>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Basic information about the user</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                placeholder="e.g. Jane Doe"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="e.g. jane.doe@company.com"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all focus:ring-4 focus:ring-cyan-500/5"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="e.g. +1 (555) 000-0000"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-all focus:ring-4 focus:ring-emerald-500/5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Security Section */}
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-10 space-y-10">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Security</h3>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Set a temporary password for the user</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all focus:ring-4 focus:ring-purple-500/5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column - Controls & Media */}
                        <div className="lg:col-span-4 space-y-10">

                            {/* Profile Picture */}
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-10 space-y-8">
                                <h3 className="text-xl font-bold text-white tracking-tight leading-none">Profile Picture</h3>
                                <div className="group relative border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-4xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                        <Camera className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <p className="text-white text-sm font-black uppercase tracking-widest">Upload Photo</p>
                                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-3">JPG or PNG (max. 1MB)</p>
                                </div>
                            </section>

                            {/* Account Status */}
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-10 space-y-8">
                                <h3 className="text-xl font-bold text-white tracking-tight leading-none">Account Status</h3>
                                <div className="space-y-3">
                                    <label className={clsx(
                                        "flex items-center justify-between px-6 py-5 rounded-2xl border cursor-pointer transition-all",
                                        formData.status === 'active' ? "bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/5" : "bg-slate-950 border-slate-800"
                                    )}>
                                        <span className={clsx("text-xs font-black uppercase tracking-[0.15em]", formData.status === 'active' ? "text-white" : "text-slate-500")}>Active</span>
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === 'active'}
                                            onChange={() => setFormData({ ...formData, status: 'active' })}
                                            className="hidden"
                                        />
                                        <div className={clsx("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", formData.status === 'active' ? "border-purple-500 bg-purple-500/20" : "border-slate-800 bg-slate-950")}>
                                            {formData.status === 'active' && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
                                        </div>
                                    </label>

                                    <label className={clsx(
                                        "flex items-center justify-between px-6 py-5 rounded-2xl border cursor-pointer transition-all",
                                        formData.status === 'inactive' ? "bg-slate-800/50 border-slate-600" : "bg-slate-950 border-slate-800"
                                    )}>
                                        <span className={clsx("text-xs font-black uppercase tracking-[0.15em]", formData.status === 'inactive' ? "text-white" : "text-slate-500")}>Inactive</span>
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === 'inactive'}
                                            onChange={() => setFormData({ ...formData, status: 'inactive' })}
                                            className="hidden"
                                        />
                                        <div className={clsx("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", formData.status === 'inactive' ? "border-slate-600 bg-slate-800" : "border-slate-800 bg-slate-950")}>
                                            {formData.status === 'inactive' && <div className="w-2.5 h-2.5 bg-slate-400 rounded-full" />}
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Access Control */}
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-4xl p-10 space-y-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-bold text-white tracking-tight leading-none">Access Control</h3>
                                    <p className="text-slate-500 text-xs font-semibold">Assign role and permissions</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Role</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                            >
                                                {allRoles.length > 0 ? allRoles.map(role => (
                                                    <option key={role._id} value={role.name}>{role.name}</option>
                                                )) : (
                                                    <option>Staff Member</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Department</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <select
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-5 py-5 text-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                                            >
                                                {departments.length > 0 ? departments.map(dept => (
                                                    <option key={dept._id} value={dept.name}>{dept.name}</option>
                                                )) : (
                                                    <option>General</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddUser;
