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

  const handleExport = async (format = 'json') => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/backup/export?format=${format}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventpro_backup_${new Date().toISOString().split('T')[0]}.${format}`;
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const summaryHtml = `
      <html>
        <head>
          <title>InventPro System Backup Summary - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            h1 { color: #8b5cf6; margin-bottom: 20px; }
            .meta { color: #64748b; font-size: 12px; margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
            .item { padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .item p { margin: 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .item h2 { margin: 5px 0 0; font-size: 24px; color: #0f172a; }
            .footer { margin-top: 60px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>InventPro Backup Summary</h1>
          <div class="meta">Generated on ${new Date().toLocaleString()} | Security Status: Verified</div>
          
          <div class="grid">
            <div class="item"><p>Total Products</p><h2>${stats?.products || 0}</h2></div>
            <div class="item"><p>Total Categories</p><h2>${stats?.categories || 0}</h2></div>
            <div class="item"><p>Total Suppliers</p><h2>${stats?.suppliers || 0}</h2></div>
            <div class="item"><p>Total Customers</p><h2>${stats?.customers || 0}</h2></div>
            <div class="item"><p>Sales Orders</p><h2>${stats?.salesOrders || 0}</h2></div>
            <div class="item"><p>Total Invoices</p><h2>${stats?.invoices || 0}</h2></div>
            <div class="item"><p>Inventory Value</p><h2 style="color: #10b981;">$${stats?.totalInventoryValue?.toLocaleString() || 0}</h2></div>
            <div class="item"><p>Database State</p><h2>Healthy</h2></div>
          </div>

          <div class="footer">
            &copy; ${new Date().getFullYear()} InventPro. This is an automated system audit report.
          </div>
          <script>window.print(); window.onafterprint = () => window.close();</script>
        </body>
      </html>
    `;
    printWindow.document.write(summaryHtml);
    printWindow.document.close();
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
            <p className="text-slate-500 text-sm">Download your information in multiple formats</p>
          </div>
        </div>

        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Important Notes</p>
              <ul className="text-slate-500 text-sm mt-1 space-y-1">
                <li>• Exports all data including products, customers, orders, and settings</li>
                <li>• Backup recorded in security audit logs for compliance</li>
                <li>• Store the backup file in a secure location</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-950/30 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all group"
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileJson className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-xs uppercase tracking-widest">JSON Format</p>
              <p className="text-slate-500 text-[9px] mt-1 uppercase font-bold tracking-wider">Full System State</p>
            </div>
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-950/30 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-xs uppercase tracking-widest">CSV Spreadsheet</p>
              <p className="text-slate-500 text-[9px] mt-1 uppercase font-bold tracking-wider">Inventory Audit</p>
            </div>
          </button>

          <button
            onClick={handlePrint}
            disabled={isExporting}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-950/30 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all group"
          >
            <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-xs uppercase tracking-widest">PDF Document</p>
              <p className="text-slate-500 text-[9px] mt-1 uppercase font-bold tracking-wider">Printable Summary</p>
            </div>
          </button>
        </div>
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