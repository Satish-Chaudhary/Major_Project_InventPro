import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Shield, ShieldCheck,
    Key, Mail, Search, MoreVertical,
    ShieldAlert, History, Edit2, Trash2,
    CheckCircle2, XCircle, ChevronRight,
    User
} from 'lucide-react';
import { clsx } from 'clsx';

import { useNavigate } from 'react-router-dom';
import { 
    useGetUsersQuery, 
    useGetRolesQuery, 
    useDeleteUserMutation,
    useDeleteRoleMutation 
} from '../redux/slices/adminSlice';
import { getStatusBadge } from '../utils/badgeStyles.jsx';

const permissionDescriptions = {
    'create_product': 'Allows creating new inventory items',
    'edit_product': 'Allows modifying existing products',
    'delete_product': 'Allows permanent removal of catalog entries',
    'update_stock': 'Controls stock level adjustments and inventory counts',
    'manage_users': 'Full control over user accounts and access levels',
    'view_reports': 'Access to analytics, financial reports and system audits',
    'manage_roles': 'Creation and configuration of security clearance archetypes',
    'manage_suppliers': 'Manage vendor relationships and supply chains',
    'manage_orders': 'Handle procurement and sales order lifecycles'
};

const UserManagement = () => {
    const navigate = useNavigate();
    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    const { data: rolesData } = useGetRolesQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [deleteRole] = useDeleteRoleMutation();

    const users = usersData?.users || [];
    const allRoles = rolesData?.roles || [];
    const onAddClick = () => navigate('/add-user');
    const [activeSubTab, setActiveSubTab] = useState('all-users');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [activeRoleMenu, setActiveRoleMenu] = useState(null);
    const [expandedRole, setExpandedRole] = useState(null);


    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'All Roles' || user.role?.toLowerCase() === roleFilter.toLowerCase();
            const matchesStatus = statusFilter === 'All Status' || user.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, roleFilter, statusFilter]);

    const subTabs = [
        { id: 'all-users', label: 'All Users', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
                </div>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold text-sm shadow-xl shadow-purple-500/20 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-800 px-2 overflow-x-auto">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={clsx(
                            "py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                            activeSubTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <tab.icon className={clsx("w-4 h-4", activeSubTab === tab.id ? "text-purple-400" : "text-slate-600")} />
                            {tab.label}
                        </div>
                        {activeSubTab === tab.id && (
                            <motion.div layoutId="subtab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeSubTab === 'all-users' && (
                    <motion.div
                        key="all-users"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Filter Bar */}
                        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full md:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Filter by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-full md:w-48 appearance-none cursor-pointer"
                            >
                                <option>All Roles</option>
                                {allRoles.map(r => <option key={r._id} value={r.name}>{r.name}</option>)}
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none w-full md:w-48 appearance-none cursor-pointer"
                            >
                                <option>All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-800/20 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                                        <th className="px-8 py-5 w-12"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></th>
                                        <th className="px-8 py-5">User</th>
                                        <th className="px-8 py-5">Role</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Last Active</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-5"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" /></td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 p-0.5 group-hover:border-purple-500/30 transition-all">
                                                        <img src={`https://i.pravatar.cc/100?u=${u.email}`} alt={u.fullName} className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-sm leading-tight">{u.fullName}</p>
                                                        <p className="text-slate-500 text-xs font-medium md:max-w-[150px] truncate">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-700/50 bg-slate-800/30 shadow-inner text-slate-400">
                                                    {u.role === 'Administrator' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {u.role}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {getStatusBadge(u.status)}
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-300 font-medium">
                                                {u.updatedAt ? format(new Date(u.updatedAt), 'MMM dd, HH:mm') : 'N/A'}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Delete this user?')) deleteUser(u._id);
                                                        }}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeSubTab === 'roles' && (
                    <motion.div
                        key="roles"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        {allRoles.map((role) => (
                            <div
                                key={role._id}
                                className={clsx(
                                    "bg-slate-900/20 border transition-all duration-300 group hover:border-slate-700 shadow-xl overflow-hidden rounded-2xl",
                                    expandedRole === role._id ? "border-purple-500 ring-1 ring-purple-500/30" : "border-slate-800/60"
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 lg:p-5">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-linear-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-purple-500/40 transition-colors">
                                            <ShieldCheck className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white tracking-tight uppercase">{role.name}</h3>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">{role.description || 'No description provided.'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] shrink-0">
                                        <div className="flex flex-col items-center">
                                            <span className="text-white text-base font-black leading-none">{users.filter(u => u.role?.toLowerCase() === role.name?.toLowerCase()).length}</span>
                                            <span className="mt-1 opacity-50">Users</span>
                                        </div>
                                        <div className="w-px h-8 bg-slate-800" />
                                        <div className="flex flex-col items-center">
                                            <span className="text-purple-400 text-base font-black leading-none">{role.permissions?.length || 0}</span>
                                            <span className="mt-1 opacity-50">Permissions</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-auto">
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveRoleMenu(activeRoleMenu === role._id ? null : role._id);
                                                }}
                                                className="p-2.5 rounded-xl bg-slate-950/40 text-slate-500 hover:text-white transition-all border border-slate-800/50"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            <AnimatePresence>
                                                {activeRoleMenu === role._id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 py-2"
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (window.confirm('Delete this role?')) deleteRole(role._id);
                                                                setActiveRoleMenu(null);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-bold uppercase tracking-widest"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete Role
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <button
                                            onClick={() => setExpandedRole(expandedRole === role._id ? null : role._id)}
                                            className={clsx(
                                                "p-2.5 rounded-xl transition-all border",
                                                expandedRole === role._id
                                                    ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20"
                                                    : "bg-slate-950/40 text-slate-500 hover:text-purple-400 border-slate-800/50"
                                            )}
                                        >
                                            <ChevronRight className={clsx("w-5 h-5 transition-transform", expandedRole === role._id ? "rotate-90" : "")} />
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedRole === role._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-slate-800/60 bg-slate-950/20"
                                        >
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {role.permissions?.map((perm, idx) => (
                                                    <div key={idx} className="flex gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl group/perm hover:border-purple-500/30 transition-all">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                                                            <Key className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">{perm.replace(/_/g, ' ')}</p>
                                                            <p className="text-slate-500 text-[9px] font-bold leading-relaxed">{permissionDescriptions[perm] || 'Standard architectural clearance'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!role.permissions || role.permissions.length === 0) && (
                                                    <div className="col-span-full py-8 text-center">
                                                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No permissions assigned</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </motion.div>
                )}

            </AnimatePresence>
        </motion.div>
    );
};

export default UserManagement;
