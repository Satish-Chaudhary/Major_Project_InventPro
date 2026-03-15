import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Package, AlertTriangle, ArrowUpDown, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import axios from 'axios'
import { serverUrl } from '../App';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/auth/me`, { withCredentials: true });
            if (response.data.success) {
                setIsLoggedIn(true);
                setUser(response.data.user);
            }
        } catch (error) {
            console.log("Not logged in");
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    // UI State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    // Data State
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Low Stock Alert', message: 'Mechanical Keyboard is below minimum level', time: '5m ago', type: 'warning', read: false },
        { id: 2, title: 'Order Received', message: 'New order #ORD-1234 from Sarah Connor', time: '1h ago', type: 'success', read: false },
        { id: 3, title: 'System Update', message: 'InventPro v2.1.0 is now live with new charts', time: '3h ago', type: 'info', read: true },
    ]);

    const [inventory, setInventory] = useState([
        { id: 1, name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', stock: 45, minStock: 20, price: 29.99, status: 'in-stock' },
        { id: 2, name: 'Mechanical Keyboard', sku: 'MK-002', category: 'Electronics', stock: 12, minStock: 15, price: 89.99, status: 'low-stock' },
        { id: 3, name: 'USB-C Hub', sku: 'UH-003', category: 'Accessories', stock: 67, minStock: 25, price: 49.99, status: 'in-stock' },
        { id: 4, name: 'Monitor Stand', sku: 'MS-004', category: 'Office', stock: 8, minStock: 10, price: 39.99, status: 'low-stock' },
        { id: 5, name: 'Webcam HD', sku: 'WC-005', category: 'Electronics', stock: 0, minStock: 15, price: 79.99, status: 'out-of-stock' },
    ]);

    const [categories, setCategories] = useState([
        { id: 1, name: 'Electronics', count: 450, stockValue: '$124,500', trend: '+12%', color: 'from-purple-500 to-indigo-500' },
        { id: 2, name: 'Furniture', count: 120, stockValue: '$86,200', trend: '-5%', color: 'from-cyan-500 to-blue-500' },
        { id: 3, name: 'Accessories', count: 890, stockValue: '$42,300', trend: '+18%', color: 'from-emerald-500 to-teal-500' },
        { id: 4, name: 'Office Supplies', count: 340, stockValue: '$31,900', trend: '+2%', color: 'from-amber-500 to-orange-500' },
        { id: 5, name: 'Laptops', count: 85, stockValue: '$210,000', trend: '+24%', color: 'from-pink-500 to-rose-500' },
        { id: 6, name: 'Smartphones', count: 160, stockValue: '$145,000', trend: '+15%', color: 'from-violet-500 to-purple-500' },
    ]);

    const [suppliers, setSuppliers] = useState([
        { id: 1, company: 'TechSupplies Inc.', code: 'SUP-001', contact: 'Sarah Jenkins', email: 'sarah@techsupplies.com', phone: '+1 (555) 123-4567', categories: ['Electronics', 'Hardware'], status: 'Active', reliability: 98, location: 'San Jose, CA' },
        { id: 2, company: 'Office Depot Suppliers', code: 'SUP-002', contact: 'Michael Chen', email: 'm.chen@officedepot.com', phone: '+1 (555) 987-6543', categories: ['Office', 'Stationery'], status: 'Active', reliability: 92, location: 'Chicago, IL' },
        { id: 3, company: 'Global Retailers', code: 'SUP-003', contact: 'Amanda Lewis', email: 'support@global.com', phone: '+44 20 7123 4567', categories: ['Furniture', 'Decor'], status: 'Inactive', reliability: 75, location: 'London, UK' },
    ]);

    const [orders, setOrders] = useState([
        { id: '#ORD-2023-884', date: 'Oct 24, 2023', time: '10:45 AM', type: 'inward', entity: 'TechSupplies Inc.', items: '120 units', value: '$4,500.00', status: 'completed' },
        { id: '#ORD-2023-883', date: 'Oct 24, 2023', time: '09:15 AM', type: 'outward', entity: 'Apex Solutions', items: '45 units', value: '$1,250.00', status: 'processing' },
        { id: '#ORD-2023-882', date: 'Oct 23, 2023', time: '04:30 PM', type: 'outward', entity: 'Global Retailers', items: '200 units', value: '$8,900.00', status: 'pending' },
        { id: '#ORD-2023-881', date: 'Oct 22, 2023', time: '11:20 AM', type: 'inward', entity: 'Office Depot', items: '50 units', value: '$2,100.00', status: 'completed' },
    ]);

    const [users, setUsers] = useState([
        { id: 1, name: 'James Anderson', email: 'james.anderson@nexus.com', role: 'Administrator', status: 'Active', color: 'text-purple-400', lastActive: 'Just now', avatar: 'https://i.pravatar.cc/100?u=1' },
        { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@nexus.com', role: 'Manager', status: 'Active', color: 'text-cyan-400', lastActive: '2 hours ago', avatar: 'https://i.pravatar.cc/100?u=2' },
        { id: 3, name: 'Michael Chen', email: 'm.chen@nexus.com', role: 'Staff', status: 'Offline', color: 'text-slate-400', lastActive: '1 day ago', avatar: 'https://i.pravatar.cc/100?u=3' },
        { id: 4, name: 'Emily Rodriguez', email: 'e.rodriguez@nexus.com', role: 'Staff', status: 'Active', color: 'text-slate-400', lastActive: '3 hours ago', avatar: 'https://i.pravatar.cc/100?u=4' },
    ]);

    // Update active tab based on URL
    useEffect(() => {
        const path = location.pathname.split('/')[1];
        if (path) {
            setActiveTab(path);
        } else {
            setActiveTab('dashboard');
        }
    }, [location]);

    // Handlers

    const logout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            setIsLoggedIn(false);
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const addProduct = (product) => {
        setInventory([product, ...inventory]);
        toast.success('Product added successfully');
        setShowAddModal(false);
    };

    const deleteProduct = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
        toast.success('Product deleted successfully');
    };

    const deleteMultipleProducts = (ids) => {
        setInventory(inventory.filter(item => !ids.includes(item.id)));
        toast.success(`${ids.length} products deleted successfully`);
    };

    const updateProduct = (updatedProduct) => {
        setInventory(inventory.map(item => item.id === updatedProduct.id ? updatedProduct : item));
        toast.success('Product updated successfully');
    };

    const addCategory = (category) => {
        setCategories([category, ...categories]);
        toast.success('Category added successfully');
    };

    const deleteCategory = (id) => {
        setCategories(categories.filter(cat => cat.id !== id));
        toast.success('Category deleted successfully');
    };

    const updateCategory = (updatedCategory) => {
        setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
        toast.success('Category updated successfully');
    };

    const addSupplier = (supplier) => {
        setSuppliers([supplier, ...suppliers]);
        toast.success('Supplier added successfully');
    };

    const addOrder = (order) => {
        setOrders([order, ...orders]);
        toast.success('Order created successfully');
    };

    const addUser = (user) => {
        setUsers([user, ...users]);
        toast.success('User added successfully');
    };

    const getStatusBadge = (status) => {
        const badges = {
            'in-stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'In Stock' },
            'low-stock': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Low Stock' },
            'out-of-stock': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Out of Stock' },
            'in stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'In Stock' },
            'low stock': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Low Stock' },
            'out of stock': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Out of Stock' },
            'active': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Active' },
            'offline': { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Offline' },
        };
        const badge = badges[status.toLowerCase()] || { bg: 'bg-slate-500/10', text: 'text-slate-400', label: status };
        return (
            <span className={clsx(
                'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent',
                badge.bg,
                badge.text,
                (status.toLowerCase() === 'low-stock' || status.toLowerCase() === 'low stock') ? 'border-amber-500/20' : (status.toLowerCase() === 'out-of-stock' || status.toLowerCase() === 'out of stock') ? 'border-red-500/20' : 'border-emerald-500/20'
            )}>
                {badge.label}
            </span>
        );
    };

    const stats = [
        { label: 'Total Products', value: inventory.length.toString(), icon: Package, trend: '+12.5%', color: 'text-purple-400' },
        { label: 'Low Stock Items', value: inventory.filter(i => i.status.toLowerCase().includes('low')).length.toString(), icon: AlertTriangle, trend: 'Needs attention', color: 'text-amber-400' },
        { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length.toString(), icon: ArrowUpDown, trend: '8 orders today', color: 'text-cyan-400' },
        { label: 'Total Revenue', value: '$48,290', icon: TrendingUp, trend: '+8.2%', color: 'text-emerald-400' },
    ];

    const dashboardData = {
        stats,
        stockTrendData: [
            { month: 'Jan', stock: 240, sold: 120 },
            { month: 'Feb', stock: 280, sold: 145 },
            { month: 'Mar', stock: 220, sold: 180 },
            { month: 'Apr', stock: 310, sold: 160 },
            { month: 'May', stock: 290, sold: 195 },
            { month: 'Jun', stock: 350, sold: 210 },
        ],
        categoryData: [
            { name: 'Electronics', value: 45, color: '#8b5cf6' },
            { name: 'Accessories', value: 25, color: '#06b6d4' },
            { name: 'Office', value: 20, color: '#10b981' },
            { name: 'Other', value: 10, color: '#f59e0b' },
        ],
        recentActivity: [
            { id: 1, action: 'Stock Updated', item: 'Wireless Mouse', user: 'John D.', time: '2 min ago', type: 'success' },
            { id: 2, action: 'Low Stock Alert', item: 'Mechanical Keyboard', user: 'System', time: '15 min ago', type: 'warning' },
            { id: 3, action: 'New Item Added', item: 'USB-C Hub', user: 'Sarah M.', time: '1 hour ago', type: 'info' },
            { id: 4, action: 'Item Deleted', item: 'Old Mouse Pad', user: 'Admin', time: '3 hours ago', type: 'danger' },
        ],
        inventory,
        getStatusBadge
    };

    const value = {
        isLoggedIn,
        user,
        setUser,
        authLoading,
        logout,
        activeTab,
        setActiveTab,
        setIsLoggedIn,
        showAddModal,
        setShowAddModal,
        searchQuery,
        setSearchQuery,
        notifications,
        inventory,
        addProduct,
        deleteProduct,
        deleteMultipleProducts,
        updateProduct,
        categories,
        addCategory,
        deleteCategory,
        updateCategory,
        suppliers,
        addSupplier,
        orders,
        addOrder,
        users,
        addUser,
        getStatusBadge,
        dashboardData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
