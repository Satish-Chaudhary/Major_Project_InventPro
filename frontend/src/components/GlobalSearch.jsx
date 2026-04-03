import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, ShoppingCart, Users, Truck, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { closeModal } from '../redux/slices/uiSlice';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { useGetCustomersQuery } from '../redux/slices/customerSlice';
import { useGetVendorsQuery } from '../redux/slices/vendorSlice';
import { clsx } from 'clsx';

const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef(null);

  const { data: productsData } = useGetProductsQuery({ search: query, limit: 5 });
  const { data: ordersData } = useGetSalesOrdersQuery({ search: query, limit: 5 });
  const { data: customersData } = useGetCustomersQuery({ search: query, limit: 5 });
  const { data: vendorsData } = useGetVendorsQuery({ search: query, limit: 5 });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    setActiveTab('all');
    onClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Truck },
  ];

  const products = productsData?.products || [];
  const orders = ordersData?.orders || [];
  const customers = customersData?.customers || [];
  const vendors = vendorsData?.suppliers || [];

  const results = {
    products: products.map(p => ({
      id: p._id,
      title: p.productName,
      subtitle: p.skuId,
      icon: Package,
      path: '/inventory'
    })),
    orders: orders.map(o => ({
      id: o._id,
      title: o.orderNumber || `Order #${o._id.slice(-6)}`,
      subtitle: o.customer?.name || 'Unknown Customer',
      icon: ShoppingCart,
      path: `/sales-order/${o._id}`
    })),
    customers: customers.map(c => ({
      id: c._id,
      title: c.name,
      subtitle: c.email,
      icon: Users,
      path: '/customers'
    })),
    vendors: vendors.map(v => ({
      id: v._id,
      title: v.company,
      subtitle: v.code,
      icon: Truck,
      path: '/suppliers'
    }))
  };

  const filteredResults = activeTab === 'all' 
    ? [...results.products, ...results.orders, ...results.customers, ...results.vendors]
    : results[activeTab] || [];

  const hasResults = filteredResults.length > 0 && query.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, orders, customers, vendors..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
              />
              <button
                onClick={handleClose}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-800 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {query.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Start typing to search...</p>
                  <p className="text-xs mt-2 text-slate-600">Press ESC to close</p>
                </div>
              ) : !hasResults ? (
                <div className="p-8 text-center text-slate-500">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredResults.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.title}</p>
                        <p className="text-slate-500 text-sm truncate">{item.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd>
                  Select
                </span>
              </div>
              <span>Press ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;