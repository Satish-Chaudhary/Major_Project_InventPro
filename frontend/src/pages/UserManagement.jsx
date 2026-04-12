import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, Shield, ShieldCheck,
    Key, Mail, Search, MoreVertical,
    ShieldAlert, History, Edit2, Trash2,
    CheckCircle2, XCircle, ChevronRight, ChevronLeft,
    User
} from 'lucide-react';
import { clsx } from 'clsx';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUser } from '../redux/slices/authSlice';
import { useSocketContext } from '../context/SocketContext';
import { getStatusBadge } from '../utils/badgeStyles.jsx';
import { ROLES } from '../config/permissions';
import { useNavigate } from 'react-router-dom';
import {
    useGetUsersQuery,
    useGetRolesQuery,
    useDeleteUserMutation,
    useDeleteRoleMutation
} from '../redux/slices/adminSlice';

const permissionDescriptions = {
    'manage_users': 'Full control over user accounts, onboarding and access levels',
    'approve_requests': 'Authorize or revoke pending staff registration requests',
    'full_audit': 'Comprehensive access to system-wide activity logs and trace data',
    'system_settings': 'Modification of global application parameters and infrastructure',
    'product_crud': 'Full lifecycle management of inventory products and assets',
    'category_crud': 'Configuration of product taxonomy and organizational groups',
    'vendor_registry': 'Management of supplier profiles and vendor performance metrics',
    'system_analytics': 'Advanced data visualization and operational intelligence',
    'advanced_reports': 'Generation of deep-dive financial and stock movement records',
    'cost_auditing': 'Detailed oversight of procurement costs and profit margins',
    'order_history': 'Read-only access to historical transaction and movement logs',
    'stock_updates': 'Adjustment of real-time stock levels and warehouse quantities',
    'procurement_tracking': 'Oversight of incoming supplies and purchase order statuses',
    'inventory_read': 'Basic visibility into inventory levels and product data',
    'create_sales_orders': 'Generation and processing of customer sales transactions',
    'sales_metrics': 'Tracking of commercial performance and revenue statistics',
    'product_discovery': 'Search and discovery capabilities within the product catalog'
};

const UserManagement = () => {
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectUser);
    const { onlineUsers } = useSocketContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({
        page: currentPage,
        search: searchQuery,
        role: roleFilter,
        status: statusFilter
    });
    
    const { data: rolesData } = useGetRolesQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [deleteRole] = useDeleteRoleMutation();

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter, statusFilter]);

    const users = usersData?.users || [];
    const pagination = usersData?.pagination || { total: 0, pages: 0, page: 1 };
    const allRoles = rolesData?.roles || [];
    const onAddClick = () => navigate('/add-user');
    const [activeSubTab, setActiveSubTab] = useState('all-users');
    const [activeRoleMenu, setActiveRoleMenu] = useState(null);
    const [expandedRole, setExpandedRole] = useState(null);


    const filteredUsers = users; 

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
                                        <th className="px-8 py-5">Department</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Last Active</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredUsers.map(u => {
                                        const isRoot = u.role?.toLowerCase() === 'root';
                                        const isAdminViewingRoot = currentUser?.role?.toLowerCase() === 'admin' && isRoot;

                                        return (
                                            <tr key={u._id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-8 py-5"><input type="checkbox" className="rounded bg-slate-900 border-slate-700" disabled={isAdminViewingRoot} /></td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 p-0.5 group-hover:border-purple-500/30 transition-all overflow-hidden">
                                                            <img 
                                                                src={u.profilePic || `https://i.pravatar.cc/100?u=${u.email}`} 
                                                                alt={u.fullName} 
                                                                className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all object-cover" 
                                                            />
                                                            {onlineUsers.includes(u._id) && (
                                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold text-sm leading-tight">{u.fullName}</p>
                                                            <p className="text-slate-500 text-xs font-medium md:max-w-[150px] truncate">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-700/50 bg-slate-800/30 shadow-inner text-slate-400">
                                                        {isRoot ? <ShieldAlert className="w-3 h-3 text-purple-400" /> : u.role === 'admin' ? <ShieldCheck className="w-3 h-3 text-cyan-400" /> : <User className="w-3 h-3" />}
                                                        {u.role}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{u.department || 'N/A'}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {getStatusBadge(u.status)}
                                                </td>
                                                <td className="px-8 py-5 text-xs text-slate-300 font-medium">
                                                    {u.updatedAt ? format(new Date(u.updatedAt), 'MMM dd, HH:mm') : 'N/A'}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-1 transition-opacity">
                                                        {!isAdminViewingRoot && (
                                                            <>
                                                                <button
                                                                    onClick={() => navigate('/add-user', { state: { editUser: u } })}
                                                                    className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (window.confirm('Delete this user?')) deleteUser(u._id);
                                                                    }}
                                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {isAdminViewingRoot && (
                                                            <div className="p-2 text-slate-600 cursor-not-allowed">
                                                                <ShieldAlert className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="px-8 py-4 border-t border-slate-800 bg-slate-900/20 flex items-center justify-between">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                                    Showing {pagination.total === 0 ? 0 : (currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} USERS
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className="p-2 text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {[...Array(pagination.pages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={clsx(
                                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                                    currentPage === i + 1 
                                                        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                                                        : "text-slate-500 hover:text-white hover:bg-slate-800"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={currentPage === pagination.pages || pagination.pages === 0}
                                        onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                                        className="p-2 text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
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
                                        {role.name?.toLowerCase() !== 'root' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Delete this role?')) deleteRole(role._id);
                                                }}
                                                className="p-2.5 rounded-xl bg-slate-950/40 text-slate-500 hover:text-red-400 transition-all border border-slate-800/50"
                                                title="Delete Role"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
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
                                                {currentUser?.role?.toLowerCase() === 'admin' && role.name?.toLowerCase() === 'root' ? (
                                                    <div className="col-span-full py-8 text-center bg-slate-900/60 rounded-2xl border border-dashed border-red-500/20">
                                                        <ShieldAlert className="w-8 h-8 text-red-500/40 mx-auto mb-3" />
                                                        <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol: Access Restricted</p>
                                                        <p className="text-slate-500 text-[9px] mt-1 font-bold uppercase">Administrator cannot view root account permissions</p>
                                                    </div>
                                                ) : role.permissions?.map((perm, idx) => (
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
                                                {(!role.permissions || role.permissions.length === 0) && (!(currentUser?.role?.toLowerCase() === 'admin' && role.name?.toLowerCase() === 'root')) && (
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
