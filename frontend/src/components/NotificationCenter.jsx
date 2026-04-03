import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, AlertTriangle, ShoppingCart, 
  Package, DollarSign, Users, Truck, Info 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  selectNotifications, 
  addNotification, 
  removeNotification, 
  clearNotifications 
} from '../redux/slices/uiSlice';
import { useGetLowStockQuery } from '../redux/slices/productSlice';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { useGetNotificationsQuery } from '../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';

const NotificationItem = ({ notification, onDismiss }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-emerald-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'order': return <ShoppingCart className="w-4 h-4 text-purple-400" />;
      case 'stock': return <Package className="w-4 h-4 text-cyan-400" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'customer': return <Users className="w-4 h-4 text-blue-400" />;
      case 'supplier': return <Truck className="w-4 h-4 text-orange-400" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/20 bg-emerald-500/5';
      case 'error': return 'border-red-500/20 bg-red-500/5';
      case 'warning': return 'border-amber-500/20 bg-amber-500/5';
      default: return 'border-slate-700 bg-slate-800/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={clsx(
        'p-4 border rounded-xl mb-2 last:mb-0',
        getTypeStyles(notification.type)
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{notification.title}</p>
          <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
          {notification.time && (
            <p className="text-xs text-slate-500 mt-2">
              {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(notification.id)}
          className="text-slate-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const NotificationCenter = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: lowStockData } = useGetLowStockQuery();
  const { data: ordersData } = useGetSalesOrdersQuery({ limit: 10 });
  const { data: unreadNotifications } = useGetUnreadNotificationsQuery();

  const lowStockProducts = lowStockData?.products || [];
  const recentOrders = ordersData?.orders || [];

  useEffect(() => {
    const checkForAlerts = () => {
      if (lowStockProducts.length > 0 && !notifications.find(n => n.type === 'stock')) {
        dispatch(addNotification({
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${lowStockProducts.length} products are running low on stock`,
          time: new Date().toISOString()
        }));
      }
    };

    const interval = setInterval(checkForAlerts, 60000);
    checkForAlerts();

    return () => clearInterval(interval);
  }, [lowStockProducts, notifications, dispatch]);

  const handleDismiss = (id) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto p-4">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No notifications</p>
                    <p className="text-xs mt-2 text-slate-600">You're all caught up!</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.slice(0, 20).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;