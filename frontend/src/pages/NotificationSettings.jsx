import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, AlertTriangle, CheckCircle, X, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-hot-toast';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    lowStockAlert: true,
    lowStockThreshold: 10,
    orderPlaced: true,
    orderDelivered: true,
    paymentReceived: true,
    newCustomer: false,
    emailNotifications: true,
    inAppNotifications: true,
    dailyDigest: false,
    weeklyReport: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification settings saved successfully');
    }, 1000);
  };

  const notificationTypes = [
    {
      key: 'lowStockAlert',
      title: 'Low Stock Alerts',
      description: 'Get notified when products fall below threshold',
      icon: AlertTriangle,
      hasThreshold: true,
      thresholdKey: 'lowStockThreshold',
      thresholdLabel: 'Alert when stock falls below'
    },
    {
      key: 'orderPlaced',
      title: 'New Orders',
      description: 'Notifications for new order placements',
      icon: CheckCircle
    },
    {
      key: 'orderDelivered',
      title: 'Order Delivered',
      description: 'Notifications when orders are delivered',
      icon: CheckCircle
    },
    {
      key: 'paymentReceived',
      title: 'Payment Received',
      description: 'Notifications for successful payments',
      icon: CheckCircle
    },
    {
      key: 'newCustomer',
      title: 'New Customers',
      description: 'Notifications when new customers register',
      icon: Bell
    }
  ];

  const notificationChannels = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail
    },
    {
      key: 'inAppNotifications',
      title: 'In-App Notifications',
      description: 'Show notifications in the dashboard',
      icon: MessageSquare
    }
  ];

  const scheduledReports = [
    {
      key: 'dailyDigest',
      title: 'Daily Digest',
      description: 'Summary of daily activities sent at 9 AM',
      icon: Bell
    },
    {
      key: 'weeklyReport',
      title: 'Weekly Report',
      description: 'Comprehensive weekly performance report',
      icon: Bell
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6 max-w-4xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Notification Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Configure how and when you receive notifications</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all font-medium disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {/* Notification Types */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          Notification Types
        </h3>
        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                  <type.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{type.title}</p>
                  <p className="text-slate-500 text-sm">{type.description}</p>
                  {type.hasThreshold && (
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-slate-400 text-xs">{type.thresholdLabel}</label>
                      <input
                        type="number"
                        value={settings[type.thresholdKey]}
                        onChange={(e) => handleChange(type.thresholdKey, Number(e.target.value))}
                        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-sm"
                        min="1"
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggle(type.key)}
                className={clsx(
                  "w-12 h-6 rounded-full transition-all relative",
                  settings[type.key] ? "bg-purple-600" : "bg-slate-700"
                )}
              >
                <div className={clsx(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  settings[type.key] ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          Notification Channels
        </h3>
        <div className="space-y-4">
          {notificationChannels.map((channel) => (
            <div key={channel.key} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                  <channel.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{channel.title}</p>
                  <p className="text-slate-500 text-sm">{channel.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(channel.key)}
                className={clsx(
                  "w-12 h-6 rounded-full transition-all relative",
                  settings[channel.key] ? "bg-purple-600" : "bg-slate-700"
                )}
              >
                <div className={clsx(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  settings[channel.key] ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          Scheduled Reports
        </h3>
        <div className="space-y-4">
          {scheduledReports.map((report) => (
            <div key={report.key} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                  <report.icon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{report.title}</p>
                  <p className="text-slate-500 text-sm">{report.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(report.key)}
                className={clsx(
                  "w-12 h-6 rounded-full transition-all relative",
                  settings[report.key] ? "bg-purple-600" : "bg-slate-700"
                )}
              >
                <div className={clsx(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  settings[report.key] ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;