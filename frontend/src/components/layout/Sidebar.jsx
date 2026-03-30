import React from 'react';
import {
    LayoutDashboard, Package, TrendingUp, Users,
    Settings, BarChart3, ArrowUpDown, LogOut, ShieldCheck, History, Truck
} from 'lucide-react';
import SideNavHeader from './SideNavHeader.jsx';
import SideNavLinks from './SideNavLinks.jsx';
import AdminProfileButton from './AdminProfileButton.jsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout, selectUser } from '../../redux/slices/authSlice';
import { ROLES } from '../../config/permissions';

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'admin-dashboard', icon: ShieldCheck, label: 'Admin Panel', roles: [ROLES.ADMIN, ROLES.ROOT] },
        { id: 'inventory', icon: Package, label: 'Inventory' },
        { id: 'approvals', icon: ShieldCheck, label: 'Staff Requests', roles: [ROLES.ADMIN, ROLES.ROOT] },
        { id: 'users', icon: Users, label: 'User Database', roles: [ROLES.ADMIN, ROLES.ROOT] },
        { id: 'roles', icon: ShieldCheck, label: 'Roles & Security', roles: [ROLES.ADMIN, ROLES.ROOT] },
        { id: 'categories', icon: Package, label: 'Item Categories', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.WAREHOUSE] },
        { id: 'audit', icon: History, label: 'Audit Logs' },
        { id: 'security', icon: ShieldCheck, label: 'Security Audit', roles: [ROLES.ADMIN, ROLES.ROOT] },
        { id: 'orders', icon: ArrowUpDown, label: 'Sales & Orders', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES, ROLES.SALES_STAFF] },
        { id: 'suppliers', icon: Users, label: 'Vendor Registry', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT] },
        { id: 'purchase-orders', icon: Truck, label: 'Purchase Orders', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT, ROLES.WAREHOUSE] },
        { id: 'analytics', icon: BarChart3, label: 'System Analytics', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT] },
        { id: 'reports', icon: BarChart3, label: 'Advanced Reports', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.ACCOUNTANT] },
        { id: 'settings', icon: Settings, label: 'System Settings', roles: [ROLES.ADMIN, ROLES.ROOT] },
    ];

    const filteredMenu = menuItems.filter(item => {
        if (!item.roles) return true;
        const userRole = user?.role?.toLowerCase();
        const normalizedRole = userRole === 'warehouse' ? ROLES.WAREHOUSE : userRole === 'sales' ? ROLES.SALES_STAFF : userRole;
        return item.roles.includes(normalizedRole);
    });

    return (
        <div className="w-64 bg-[#0a0a0a] border-r border-slate-800 min-h-screen p-4 flex flex-col sticky top-0 h-screen overflow-y-auto scrollbar-hide">

            <nav className="flex-1 space-y-1">
                {filteredMenu.map((item, idx) => (
                    <SideNavLinks key={idx} id={item.id} Icon={item.icon} label={item.label} />
                ))}
            </nav>

            <div className="mt-8 space-y-4">

                <AdminProfileButton />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
