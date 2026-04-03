import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Database, FileJson, Trash2, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BackupExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/backup/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/backup/export', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventpro_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Backup exported successfully');
    } catch (error) {
      toast.error('Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  const dataSummary = stats ? [
    { label: 'Products', value: stats.products, color: 'purple' },
    { label: 'Categories', value: stats.categories, color: 'cyan' },
    { label: 'Suppliers', value: stats.suppliers, color: 'emerald' },
    { label: 'Customers', value: stats.customers, color: 'amber' },
    { label: 'Sales Orders', value: stats.salesOrders, color: 'rose' },
    { label: 'Invoices', value: stats.invoices, color: 'violet' },
    { label: 'Users', value: stats.users, color: 'sky' },
    { label: 'Active Users', value: stats.activeUsers, color: 'lime' },
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 space-y-6 max-w-4xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Backup & Export</h2>
          <p className="text-slate-500 text-sm mt-1">Export and backup your data</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Export Data</h3>
            <p className="text-slate-500 text-sm">Download all your data as a JSON backup file</p>
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Important Notes</p>
              <ul className="text-slate-500 text-sm mt-1 space-y-1">
                <li>• Exports all data including products, customers, orders, and settings</li>
                <li>• User passwords are not included in the export</li>
                <li>• Store the backup file in a secure location</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 w-full py-3 bg-linear-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileJson className="w-5 h-5" />
              Export Full Backup (JSON)
            </>
          )}
        </button>
      </div>

      {/* Database Stats */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Database Statistics</h3>
              <p className="text-slate-500 text-sm">Overview of your data</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            disabled={isLoadingStats}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoadingStats ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dataSummary.map((item, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-2xl font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500">
            Loading statistics...
          </div>
        )}

        {stats && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Inventory Value</p>
                <p className="text-2xl font-black text-emerald-400">
                  ${stats.totalInventoryValue?.toLocaleString() || 0}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BackupExport;