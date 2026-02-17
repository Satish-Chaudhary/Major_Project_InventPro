import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Download, Calendar, Filter,
    BarChart, Layers, Send, ChevronRight,
    Clock, CheckCircle, FileSpreadsheet, File
} from 'lucide-react';
import { clsx } from 'clsx';

const Reports = () => {
    const [exportFormat, setExportFormat] = useState('csv');

    const recentExports = [
        { id: 1, name: 'inventory_q3.csv', date: 'Oct 24, 2023', size: '2.4 MB', type: 'csv' },
        { id: 2, name: 'sales_report_oct.pdf', date: 'Oct 22, 2023', size: '1.1 MB', type: 'pdf' },
        { id: 3, name: 'suppliers_list.xlsx', date: 'Oct 15, 2023', size: '450 KB', type: 'xlsx' },
        { id: 4, name: 'low_stock_alert.csv', date: 'Oct 10, 2023', size: '12 KB', type: 'csv' },
    ];

    const reportCategories = [
        { name: 'Financial Reports', icon: BarChart, items: ['Revenue Summary', 'Expense Tracking', 'Profit Margins'] },
        { name: 'Inventory Reports', icon: Layers, items: ['Stock Valuation', 'Waste Analysis', 'Moving Items'] },
        { name: 'System Logs', icon: Clock, items: ['User Activity', 'Audit Trail', 'Error Logs'] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Reports & Export</h2>
                    <p className="text-slate-400 text-sm mt-1">Generate and schedule system reports.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-all text-sm font-medium border border-slate-700">
                        <Calendar className="w-4 h-4" />
                        Schedule Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Export Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-6 bg-purple-500 rounded-full" />
                            <h3 className="text-lg font-bold text-white tracking-tight">Export Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Data Source</label>
                                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer">
                                    <option>Product Inventory</option>
                                    <option>Sales Transactions</option>
                                    <option>Supplier Directives</option>
                                    <option>User Activities</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Date Range</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input type="text" defaultValue="01-10-2023" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm" />
                                    </div>
                                    <span className="text-slate-600">-</span>
                                    <div className="relative flex-1">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input type="text" defaultValue="31-10-2023" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Export Format</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'csv', icon: FileText, label: 'CSV', sub: 'Spreadsheet' },
                                    { id: 'pdf', icon: File, label: 'PDF', sub: 'Document' },
                                    { id: 'xlsx', icon: FileSpreadsheet, label: 'Excel', sub: 'Microsoft' },
                                ].map((fmt) => (
                                    <button
                                        key={fmt.id}
                                        onClick={() => setExportFormat(fmt.id)}
                                        className={clsx(
                                            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group",
                                            exportFormat === fmt.id
                                                ? "bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/5"
                                                : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                        )}
                                    >
                                        <fmt.icon className={clsx("w-8 h-8 mb-2 transition-colors", exportFormat === fmt.id ? "text-purple-400" : "text-slate-600 group-hover:text-slate-400")} />
                                        <span className={clsx("font-bold", exportFormat === fmt.id ? "text-white" : "text-slate-400")}>{fmt.label}</span>
                                        <span className="text-[10px] text-slate-600 uppercase tracking-tighter mt-1">{fmt.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Columns to Include</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Product Name', 'SKU / Barcode', 'Stock Quantity', 'Category', 'Cost Price', 'Selling Price', 'Supplier', 'Created At'].map(col => (
                                    <label key={col} className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors group">
                                        <div className="w-5 h-5 rounded border border-slate-700 bg-slate-900 flex items-center justify-center group-hover:border-purple-500/50 transition-all">
                                            <div className="w-3 h-3 bg-purple-500 rounded-sm opacity-100" />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium">{col}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-500/10 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3">
                            <Download className="w-5 h-5" />
                            Generate & Download Report
                        </button>
                    </section>
                </div>

                {/* Right: History & Quick Actions */}
                <div className="space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            Recent Exports
                        </h3>
                        <div className="space-y-4">
                            {recentExports.map((exp) => (
                                <div key={exp.id} className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl hover:border-slate-700 transition-all group flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                                        {exp.type === 'pdf' ? <File className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white truncate">{exp.name}</p>
                                        <p className="text-[11px] text-slate-500 font-medium">{exp.date} • {exp.size}</p>
                                    </div>
                                    <button className="p-2 text-slate-500 hover:text-white"><Download className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <button className="w-full py-2 text-xs text-slate-500 hover:text-purple-400 font-bold uppercase tracking-widest transition-colors mt-2">View All History</button>
                        </div>
                    </section>

                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                            <h3 className="text-md font-bold text-white">Automated Reports</h3>
                        </div>
                        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4">
                            <p className="text-[11px] text-cyan-200 leading-relaxed font-medium">
                                You can schedule recurring exports in the <span className="text-white hover:underline cursor-pointer">Settings</span> menu to receive weekly updates via email.
                            </p>
                        </div>
                        <div className="mt-6 space-y-3">
                            {['Weekly Sales Summary', 'Monthly Stock Valuation', 'Dailly Order Log'].map(item => (
                                <div key={item} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                                    <span className="text-xs text-slate-300 font-bold">{item}</span>
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 rounded uppercase tracking-tighter">Active</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default Reports;
