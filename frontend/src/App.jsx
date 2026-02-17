import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProductsList from './pages/Products';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import UserManagement from './pages/UserManagement';
import UserApprovals from './pages/UserApprovals';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import AddUser from './pages/AddUser';
import { clsx } from 'clsx';
import { Toaster, toast } from 'react-hot-toast';

import { Package, AlertTriangle, ArrowUpDown, TrendingUp } from 'lucide-react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';


const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path) {
      setActiveTab(path);
    } else {
      setActiveTab('dashboard');
    }
  }, [location]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const stats = [
    { label: 'Total Products', value: '1,248', icon: Package, trend: '+12.5%', color: 'text-purple-400' },
    { label: 'Low Stock Items', value: '15', icon: AlertTriangle, trend: 'Needs attention', color: 'text-amber-400' },
    { label: 'Pending Orders', value: '42', icon: ArrowUpDown, trend: '8 orders today', color: 'text-cyan-400' },
    { label: 'Total Revenue', value: '$48,290', icon: TrendingUp, trend: '+8.2%', color: 'text-emerald-400' },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'in-stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'In Stock' },
      'low-stock': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Low Stock' },
      'out-of-stock': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Out of Stock' },
    };
    const badge = badges[status] || badges['in-stock'];
    return (
      <span className={clsx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent', badge.bg, badge.text, status === 'low-stock' ? 'border-amber-500/20' : status === 'out-of-stock' ? 'border-red-500/20' : 'border-emerald-500/20')}>
        {badge.label}
      </span>
    );
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => { setIsLoggedIn(true); toast.success('Welcome back, Admin!'); }} />;
  }

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

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b', borderRadius: '12px' },
      }} />
      <Header
        activeTab={activeTab}
        notifications={notifications}
        onAddClick={() => setShowAddModal(true)}
      />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => { setIsLoggedIn(false); toast.success('Logged out successfully'); }}
      />

      <AddProduct
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(product) => {
          setInventory([product, ...inventory]);
          toast.success('Product added successfully');
        }}
      />

      <main className="flex-1 overflow-x-hidden pt-2">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path='/dashboard' element={<Dashboard {...dashboardData} />} />
          <Route path='/inventory' element={<ProductsList inventory={inventory} getStatusBadge={getStatusBadge} />} />
          <Route path='/categories' element={<Categories onAddClick={() => navigate('/add-category')} />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/users' element={<UserManagement onAddClick={() => navigate('/add-user')} />} />
          <Route path='/approvals' element={<UserApprovals />} />
          <Route path='/add-category' element={<AddCategory isOpen={true} onClose={() => navigate('/categories')} />} />
          <Route path='/add-user' element={<AddUser isOpen={true} onClose={() => navigate('/users')} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>


    </>
  );
};

export default App;