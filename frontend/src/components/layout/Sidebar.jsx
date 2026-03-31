import React from 'react';
import {
    LayoutDashboard, Package, TrendingUp, Users,
    Settings, BarChart3, ArrowUpDown, LogOut, ShieldCheck, History, Truck, ShoppingCart
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
        { id: 'inventory', icon: Package, label: 'Inventory Management' },
        { id: 'cart', icon: ShoppingCart, label: 'Shopping Cart (POS)' },
        { id: 'sales-orders', icon: TrendingUp, label: 'Client Sales', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT] },
        { id: 'invoices', icon: History, label: 'Billing & Invoices', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.ACCOUNTANT, ROLES.MANAGER, ROLES.SALES_STAFF] },
        { id: 'customers', icon: Users, label: 'Customer CRM', roles: [ROLES.ADMIN, ROLES.ROOT, ROLES.MANAGER, ROLES.SALES_STAFF, ROLES.ACCOUNTANT] },
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
