import React from 'react';
import {
    LayoutDashboard, Package, TrendingUp, Users,
    Settings, BarChart3, ArrowUpDown, LogOut, ShieldCheck
} from 'lucide-react';
import SideNavHeader from './SideNavHeader.jsx';
import SideNavLinks from './SideNavLinks.jsx';
import AdminProfileButton from './AdminProfileButton.jsx';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'inventory', icon: Package, label: 'Inventory' },
        { id: 'categories', icon: Package, label: 'Categories' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'orders', icon: ArrowUpDown, label: 'Orders' },
        { id: 'suppliers', icon: Users, label: 'Suppliers' },
        { id: 'reports', icon: BarChart3, label: 'Reports' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'approvals', icon: ShieldCheck, label: 'Approvals' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-[#0a0a0a] border-r border-slate-800 min-h-screen p-4 flex flex-col sticky top-0 h-screen overflow-y-auto scrollbar-hide">

            <nav className="flex-1 space-y-1">
                {menuItems.map((item, idx) => (
                    <SideNavLinks key={idx} id={item.id} Icon={item.icon} label={item.label} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
                ))}
            </nav>

            <div className="mt-8 space-y-4">

                <AdminProfileButton activeTab={activeTab} setActiveTab={setActiveTab} />
                <button
                    onClick={onLogout}
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
