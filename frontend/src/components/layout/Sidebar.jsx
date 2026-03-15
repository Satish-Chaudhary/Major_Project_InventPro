import React from 'react';
import {
    LayoutDashboard, Package, TrendingUp, Users,
    Settings, BarChart3, ArrowUpDown, LogOut, ShieldCheck
} from 'lucide-react';
import SideNavHeader from './SideNavHeader.jsx';
import SideNavLinks from './SideNavLinks.jsx';
import AdminProfileButton from './AdminProfileButton.jsx';

import { useApp } from '../../context/AppContext';

const Sidebar = () => {
    const { activeTab, setActiveTab, logout, user } = useApp();
    
    const rolePermissions = {
        'admin': ['dashboard', 'admin-dashboard', 'inventory', 'approvals', 'users', 'roles', 'categories', 'orders', 'suppliers', 'analytics', 'reports', 'settings'],
        'manager': ['dashboard', 'inventory', 'categories', 'orders', 'suppliers', 'analytics', 'reports'],
        'warehouse staff': ['dashboard', 'inventory', 'categories'],
        'sales staff': ['dashboard', 'inventory', 'orders'],
        'accountant': ['dashboard', 'inventory', 'suppliers', 'analytics', 'reports'],
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'admin-dashboard', icon: ShieldCheck, label: 'Admin Panel', roles: ['admin'] },
        { id: 'inventory', icon: Package, label: 'Products & Inventory' },
        { id: 'approvals', icon: ShieldCheck, label: 'Staff Requests', roles: ['admin'] },
        { id: 'users', icon: Users, label: 'User Database', roles: ['admin'] },
        { id: 'roles', icon: ShieldCheck, label: 'Roles & Security', roles: ['admin'] },
        { id: 'categories', icon: Package, label: 'Item Categories', roles: ['admin', 'manager', 'warehouse staff'] },
        { id: 'orders', icon: ArrowUpDown, label: 'Sales & Orders', roles: ['admin', 'manager', 'sales staff'] },
        { id: 'suppliers', icon: Users, label: 'Vendor Registry', roles: ['admin', 'manager', 'accountant'] },
        { id: 'analytics', icon: BarChart3, label: 'System Analytics', roles: ['admin', 'manager', 'accountant'] },
        { id: 'reports', icon: BarChart3, label: 'Advanced Reports', roles: ['admin', 'manager', 'accountant'] },
        { id: 'settings', icon: Settings, label: 'System Settings', roles: ['admin'] },
    ];

    const filteredMenu = menuItems.filter(item => {
        if (!item.roles) return true; // Visible to everyone if no roles specified
        return item.roles.includes(user?.role?.toLowerCase());
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
                    onClick={logout}
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
