import React, { useState } from 'react';
import {
    LayoutDashboard, Package, TrendingUp, Users,
    Settings, BarChart3, ArrowUpDown, LogOut, ShieldCheck, History, Truck, ArrowRightLeft,
    AlertTriangle
} from 'lucide-react';
import SideNavHeader from './SideNavHeader.jsx';
import SideNavLinks from './SideNavLinks.jsx';
import AdminProfileButton from './AdminProfileButton.jsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout, selectUser } from '../../redux/slices/authSlice';
import { ROLES } from '../../config/permissions';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        setShowLogoutConfirm(false);
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'inventory', icon: Package, label: 'Inventory Management' },
        { id: 'stock-movement', icon: ArrowRightLeft, label: 'Stock Movement', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE] },
        { id: 'sales-orders', icon: TrendingUp, label: 'Client Sales', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT] },
        { id: 'invoices', icon: History, label: 'Billing & Invoices', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.ACCOUNTANT, ROLES.MANAGER, ROLES.SALES_STAFF] },
        { id: 'customers', icon: Users, label: 'Customer CRM', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT] },
        { id: 'reports', icon: BarChart3, label: 'Reports', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT] },
        { id: 'settings', icon: Settings, label: 'Setting' },
    ];

    const filteredMenu = menuItems.filter(item => {
        if (!item.roles) return true;

        const userRole = user?.role?.toLowerCase();

        // Root has access to everything
        if (userRole === ROLES.ROOT) return true;

        return item.roles.includes(userRole);
    });

    return (
        <>
            <div className="w-64 bg-[#0a0a0a] border-r border-slate-800 min-h-screen p-4 flex flex-col sticky top-0 h-screen overflow-y-auto scrollbar-hide no-print">

                <nav className="flex-1 space-y-1">
                    {filteredMenu.map((item, idx) => (
                        <SideNavLinks key={idx} id={item.id} Icon={item.icon} label={item.label} />
                    ))}
                </nav>

                <div className="mt-8 space-y-4">

                    <AdminProfileButton />
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutConfirm(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />

                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="relative bg-[#0d0d0d] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-7 h-7 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg tracking-tight">Confirm Logout</h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Are you sure you want to log out? Any unsaved changes will be lost.
                                    </p>
                                </div>

                                <div className="flex gap-3 w-full mt-2">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
