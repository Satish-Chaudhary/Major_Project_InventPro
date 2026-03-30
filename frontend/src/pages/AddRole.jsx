import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, Briefcase, Check, X, 
    ShieldCheck, Plus, ChevronRight, Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    useAddRoleMutation, 
    useUpdateRoleMutation, 
    useAddDepartmentMutation 
} from '../redux/slices/adminSlice';
import { toast } from 'react-hot-toast';

const AddRole = ({ isOpen = true }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [addRole] = useAddRoleMutation();
    const [updateRole] = useUpdateRoleMutation();
    const [addDepartment] = useAddDepartmentMutation();
    const onClose = () => navigate('/roles');

    const editRole = location.state?.editRole;
    const isEditing = !!editRole;

    const [activeSection, setActiveSection] = useState('role'); // 'role' or 'department'
    
    const [roleForm, setRoleForm] = useState({
        name: '',
        description: '',
        permissions: []
    });

    useEffect(() => {
        if (editRole) {
            setRoleForm({
                _id: editRole._id,
                name: editRole.name,
                description: editRole.description || '',
                permissions: editRole.permissions || []
            });
            setActiveSection('role');
        }
    }, [editRole]);

    const [deptForm, setDeptForm] = useState({
        name: '',
        description: ''
    });

    const availablePermissions = [
        { id: 'create_product', label: 'Create Product' },
        { id: 'edit_product', label: 'Edit Product' },
        { id: 'delete_product', label: 'Delete Product' },
        { id: 'update_stock', label: 'Update Stock' },
        { id: 'manage_users', label: 'Manage Users' },
        { id: 'view_reports', label: 'View Reports' },
        { id: 'manage_roles', label: 'Manage Roles' },
        { id: 'manage_suppliers', label: 'Manage Suppliers' },
        { id: 'manage_orders', label: 'Manage Orders' }
    ];

    const togglePermission = (permId) => {
        if (roleForm.permissions.includes(permId)) {
            setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter(p => p !== permId) });
        } else {
            setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, permId] });
        }
    };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateRole({ id: roleForm._id, ...roleForm }).unwrap();
                toast.success('Role updated successfully');
            } else {
                await addRole(roleForm).unwrap();
                toast.success('Role created successfully');
            }
            onClose();
        } catch (err) {
            toast.error(err.data?.message || 'Failed to fix role configuration');
        }
    };

    const handleDeptSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDepartment(deptForm).unwrap();
            toast.success('Department created successfully');
            onClose();
        } catch (err) {
            toast.error(err.data?.message || 'Failed to deploy department');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-linear-to-r from-purple-500/5 to-cyan-500/5">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                            <span>Security</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-slate-300">{isEditing ? 'Reconfigure' : 'Deploy New'} {activeSection === 'role' ? 'Role' : 'Department'}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{isEditing ? 'Architectural Update' : 'System Infrastructure'}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold uppercase tracking-widest hover:bg-slate-800 transition-all text-[10px]"
                        >
                            Cancel
                        </button>
                        <button
                            form={activeSection === 'role' ? "role-form" : "dept-form"}
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all text-[10px]"
                        >
                            <Check className="w-4 h-4" />
                            {isEditing ? 'Commit Update' : `Deploy ${activeSection === 'role' ? 'Role' : 'Department'}`}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-10 border-b border-slate-800 bg-slate-900/20">
                    <button
                        onClick={() => setActiveSection('role')}
                        className={clsx(
                            "px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeSection === 'role' ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Role Creation
                        </div>
                        {activeSection === 'role' && (
                            <motion.div layoutId="deploy-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveSection('department')}
                        className={clsx(
                            "px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeSection === 'department' ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Department Creation
                        </div>
                        {activeSection === 'department' && (
                            <motion.div layoutId="deploy-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {activeSection === 'role' ? (
                        <form id="role-form" onSubmit={handleRoleSubmit} className="space-y-10">
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Role Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={roleForm.name}
                                        onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                        placeholder="e.g. Regional Manager"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={roleForm.description}
                                        onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                                        placeholder="Briefly describe the responsibilities..."
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                                    />
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white tracking-tight">Permissions Matrix</h3>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                                        {roleForm.permissions.length} Selected
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {availablePermissions.map((perm) => (
                                        <button
                                            key={perm.id}
                                            type="button"
                                            onClick={() => togglePermission(perm.id)}
                                            className={clsx(
                                                "p-4 rounded-2xl border text-left transition-all relative group",
                                                roleForm.permissions.includes(perm.id) 
                                                    ? "bg-purple-500/10 border-purple-500/50" 
                                                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <ShieldCheck className={clsx("w-5 h-5", roleForm.permissions.includes(perm.id) ? "text-purple-400" : "text-slate-600")} />
                                                <div className={clsx(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                    roleForm.permissions.includes(perm.id) ? "border-purple-500 bg-purple-500" : "border-slate-800"
                                                )}>
                                                    {roleForm.permissions.includes(perm.id) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </div>
                                            <p className={clsx("text-xs font-bold leading-tight", roleForm.permissions.includes(perm.id) ? "text-white" : "text-slate-400")}>{perm.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </form>
                    ) : (
                        <form id="dept-form" onSubmit={handleDeptSubmit} className="space-y-10">
                            <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-8 space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Department Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={deptForm.name}
                                        onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                                        placeholder="e.g. Human Resources"
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        rows="4"
                                        value={deptForm.description}
                                        onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                                        placeholder="Briefly describe the department's function..."
                                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                                    />
                                </div>
                            </section>

                            <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-start gap-4">
                                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                                <div>
                                    <p className="text-white text-sm font-bold">Organization Architecture</p>
                                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">Departments help in organizing users and tracking resource allocation across the system. New departments will be immediately available in the user onboarding process.</p>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AddRole;
