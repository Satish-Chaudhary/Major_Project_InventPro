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
    const [lastReadTime, setLastReadTime] = useState(parseInt(localStorage.getItem('lastReadAuditTime')) || 0);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allRoles, setAllRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/products/all`, { withCredentials: true });
            if (response.data.success) {
                setInventory(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            // Fallback during development if DB is empty
            // setInventory([]); 
        } finally {
            setLoading(false);
        }
    };

    const fetchRolesAndDepts = async () => {
        try {
            const [rolesRes, deptsRes] = await Promise.all([
                axios.get(`${serverUrl}/api/admin/roles/all`, { withCredentials: true }),
                axios.get(`${serverUrl}/api/admin/departments/all`, { withCredentials: true })
            ]);
            if (rolesRes.data.success) setAllRoles(rolesRes.data.roles);
            if (deptsRes.data.success) setDepartments(deptsRes.data.departments);
        } catch (error) {
            console.error("Error fetching roles/depts:", error);
        }
    };

    const fetchUsers = async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`${serverUrl}/api/admin/users/all?${params}`, { withCredentials: true });
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/admin/audit-logs/all`, { withCredentials: true });
            if (response.data.success) {
                setAuditLogs(response.data.logs);
            }
        } catch (error) {
            console.error("Error fetching audit logs:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
            fetchCategories();
            fetchRolesAndDepts();
            fetchUsers();
            fetchAuditLogs();
        }
    }, [isLoggedIn]);

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/categories/all`, { withCredentials: true });
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const addRole = async (roleData) => {
        try {
            const response = await axios.post(`${serverUrl}/api/admin/roles/add`, roleData, { withCredentials: true });
            if (response.data.success) {
                setAllRoles([...allRoles, response.data.role]);
                toast.success('Role created successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create role');
        }
    };

    const updateRole = async (roleData) => {
        try {
            const { _id, ...data } = roleData;
            const response = await axios.put(`${serverUrl}/api/admin/roles/update/${_id}`, data, { withCredentials: true });
            if (response.data.success) {
                setAllRoles(allRoles.map(r => r._id === _id ? response.data.role : r));
                toast.success('Role updated successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const deleteRole = async (id) => {
        try {
            const response = await axios.delete(`${serverUrl}/api/admin/roles/delete/${id}`, { withCredentials: true });
            if (response.data.success) {
                setAllRoles(allRoles.filter(r => r._id !== id));
                toast.success('Role deleted successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete role');
        }
    };

    const addDepartment = async (deptData) => {
        try {
            const response = await axios.post(`${serverUrl}/api/admin/departments/add`, deptData, { withCredentials: true });
            if (response.data.success) {
                setDepartments([...departments, response.data.department]);
                toast.success('Department created successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create department');
        }
    };


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

    const [users, setUsers] = useState([]);

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

    const addProduct = async (product) => {
        try {
            const formData = new FormData();
            Object.keys(product).forEach(key => {
                if (key === 'productImage' && product[key] instanceof File) {
                    formData.append('productImage', product[key]);
                } else {
                    formData.append(key, product[key]);
                }
            });

            const response = await axios.post(`${serverUrl}/api/products/add`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setInventory([response.data.product, ...inventory]);
                toast.success('Product added successfully');
                fetchAuditLogs();
                setShowAddModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`${serverUrl}/api/products/delete/${id}`, { withCredentials: true });
            if (response.data.success) {
                setInventory(inventory.filter(item => item._id !== id));
                toast.success('Product deleted successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const deleteMultipleProducts = async (ids) => {
        try {
            // Backend currently only has delete individual, but we can do a loop or add a bulk delete later
            // For now, let's just delete them individually via loop if we have many
            // Better to add a bulk delete route later.
            let successCount = 0;
            for (const id of ids) {
                const response = await axios.delete(`${serverUrl}/api/products/delete/${id}`, { withCredentials: true });
                if (response.data.success) {
                    successCount++;
                }
            }
            setInventory(inventory.filter(item => !ids.includes(item._id)));
            toast.success(`${successCount} products deleted successfully`);
        } catch (error) {
            toast.error('Failed to delete some products');
        }
    };

    const updateProduct = async (updatedProduct) => {
        try {
            const { _id, ...rest } = updatedProduct;
            const formData = new FormData();
            Object.keys(rest).forEach(key => {
                if (key === 'productImage' && rest[key] instanceof File) {
                    formData.append('productImage', rest[key]);
                } else {
                    formData.append(key, rest[key]);
                }
            });

            const response = await axios.put(`${serverUrl}/api/products/update/${_id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setInventory(inventory.map(item => item._id === _id ? response.data.product : item));
                toast.success('Product updated successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    const addCategory = async (category) => {
        try {
            const formData = new FormData();
            Object.keys(category).forEach(key => {
                if (key === 'thumbnail' && category[key] instanceof File) {
                    formData.append('thumbnail', category[key]);
                } else {
                    formData.append(key, category[key]);
                }
            });

            const response = await axios.post(`${serverUrl}/api/categories/add`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setCategories([response.data.category, ...categories]);
                toast.success('Category added successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

    const deleteCategory = async (id) => {
        try {
            const response = await axios.delete(`${serverUrl}/api/categories/delete/${id}`, { withCredentials: true });
            if (response.data.success) {
                setCategories(categories.filter(cat => cat._id !== id));
                toast.success('Category deleted successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const updateCategory = async (updatedCategory) => {
        try {
            const { _id, ...rest } = updatedCategory;
            const formData = new FormData();
            Object.keys(rest).forEach(key => {
                if (key === 'thumbnail' && rest[key] instanceof File) {
                    formData.append('thumbnail', rest[key]);
                } else {
                    formData.append(key, rest[key]);
                }
            });

            const response = await axios.put(`${serverUrl}/api/categories/update/${_id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setCategories(categories.map(cat => cat._id === _id ? response.data.category : cat));
                toast.success('Category updated successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    const addSupplier = (supplier) => {
        setSuppliers([supplier, ...suppliers]);
        toast.success('Supplier added successfully');
    };

    const addOrder = (order) => {
        setOrders([order, ...orders]);
        toast.success('Order created successfully');
    };

    const addUser = async (userData) => {
        try {
            const response = await axios.post(`${serverUrl}/api/admin/users/add`, userData, { withCredentials: true });
            if (response.data.success) {
                setUsers([response.data.user, ...users]);
                toast.success('User created successfully');
                fetchAuditLogs();
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
            return false;
        }
    };

    const updateAdminUser = async (id, userData) => {
        try {
            const response = await axios.put(`${serverUrl}/api/admin/users/update/${id}`, userData, { withCredentials: true });
            if (response.data.success) {
                setUsers(users.map(u => u._id === id ? response.data.user : u));
                toast.success('User updated successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const deleteAdminUser = async (id) => {
        try {
            const response = await axios.delete(`${serverUrl}/api/admin/users/delete/${id}`, { withCredentials: true });
            if (response.data.success) {
                setUsers(users.filter(u => u._id !== id));
                toast.success('User deleted successfully');
                fetchAuditLogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
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

    const clearNotifications = () => {
        const now = Date.now();
        setLastReadTime(now);
        localStorage.setItem('lastReadAuditTime', now);
    };

    const notifications = auditLogs.filter(log => new Date(log.createdAt).getTime() > lastReadTime);

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
        clearNotifications,
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
        updateAdminUser,
        deleteAdminUser,
        fetchUsers,
        auditLogs,
        fetchAuditLogs,
        allRoles,
        addRole,
        updateRole,
        deleteRole,
        departments,
        addDepartment,
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
