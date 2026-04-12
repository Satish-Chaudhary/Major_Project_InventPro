import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Download, Calendar, BarChart, Layers, Clock,
    CheckCircle, FileSpreadsheet, File, ArrowRight, Filter,
    Database, ShoppingCart, Users, ClipboardList, RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useGetProductsQuery } from '../redux/slices/productSlice';
import { useGetSalesOrdersQuery } from '../redux/slices/salesOrderSlice';
import { useGetVendorsQuery } from '../redux/slices/vendorSlice';
import { useGetOrdersQuery } from '../redux/slices/orderSlice';
import { useLogDownloadMutation, useGetRecentExportsQuery } from '../redux/slices/reportSlice';
import { useGetActivitiesQuery } from '../redux/slices/activitySlice';
import { useGetPurchaseOrdersQuery } from '../redux/slices/purchaseOrderSlice';

const Reports = () => {
    const [exportFormat, setExportFormat] = useState('csv');
    const [dataSource, setDataSource] = useState('products');
    const [selectedColumns, setSelectedColumns] = useState([
        'productName', 'skuId', 'initialQty', 'category', 'costPrice', 'basePrice', 'supplier', 'createdAt'
    ]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [isExporting, setIsExporting] = useState(false);

    const navigate = useNavigate();

    const { data: productsData } = useGetProductsQuery({ limit: 5000 });
    const { data: salesOrdersData } = useGetSalesOrdersQuery({ limit: 5000 });
    const { data: posData } = useGetPurchaseOrdersQuery({ limit: 5000 });
    const { data: vendorsData } = useGetVendorsQuery({});
    const { data: ordersData } = useGetOrdersQuery({ limit: 5000 });
    const { data: activitiesData } = useGetActivitiesQuery({ limit: 5000 });
    const { data: recentExportsData, refetch: refetchExports } = useGetRecentExportsQuery();

    const [logDownload] = useLogDownloadMutation();

    const dataSources = [
        { id: 'products', label: 'Product Inventory', icon: Database, desc: 'Export all product data' },
        { id: 'sales', label: 'Sales Transactions', icon: ShoppingCart, desc: 'Export sales order data' },
        { id: 'suppliers', label: 'Supplier Directives', icon: Users, desc: 'Export supplier/vendor data' },
        { id: 'orders', label: 'Internal Operations', icon: ClipboardList, desc: 'Export inventory move data' },
        { id: 'activities', label: 'Full Audit Logs', icon: Clock, desc: 'Export system audit history' },
    ];

    const columnOptions = {
        products: [
            { id: 'productName', label: 'Product Name' },
            { id: 'skuId', label: 'SKU / Barcode' },
            { id: 'initialQty', label: 'Stock Quantity' },
            { id: 'category', label: 'Category' },
            { id: 'costPrice', label: 'Cost Price' },
            { id: 'basePrice', label: 'Selling Price' },
            { id: 'supplier', label: 'Supplier' },
            { id: 'createdAt', label: 'Created At' },
        ],
        sales: [
            { id: 'orderNumber', label: 'Order Number' },
            { id: 'customer', label: 'Customer' },
            { id: 'items', label: 'Items' },
            { id: 'subtotal', label: 'Subtotal' },
            { id: 'taxAmount', label: 'Tax' },
            { id: 'total', label: 'Total' },
            { id: 'paymentStatus', label: 'Payment Status' },
            { id: 'orderStatus', label: 'Order Status' },
            { id: 'createdAt', label: 'Created At' },
        ],
        suppliers: [
            { id: 'company', label: 'Company' },
            { id: 'code', label: 'Code' },
            { id: 'email', label: 'Email' },
            { id: 'phone', label: 'Phone' },
            { id: 'location', label: 'Location' },
            { id: 'status', label: 'Status' },
            { id: 'reliability', label: 'Reliability' },
        ],
        orders: [
            { id: 'orderNumber', label: 'Order Number' },
            { id: 'customer', label: 'Customer' },
            { id: 'type', label: 'Type' },
            { id: 'status', label: 'Status' },
            { id: 'value', label: 'Value' },
            { id: 'paymentStatus', label: 'Payment Status' },
            { id: 'createdAt', label: 'Created At' },
        ],
        activities: [
            { id: 'action', label: 'Action' },
            { id: 'module', label: 'Module' },
            { id: 'user', label: 'User' },
            { id: 'ipAddress', label: 'IP Address' },
            { id: 'createdAt', label: 'Date' },
        ],
    };

    const dataSourceLabels = {
        products: 'Product Inventory',
        sales: 'Sales Transactions',
        suppliers: 'Supplier Directives',
        orders: 'Internal Operations',
        activities: 'Full Audit Logs',
    };

    const exportFormats = [
        { id: 'csv', icon: FileText, label: 'CSV', sub: 'Spreadsheet', color: 'emerald' },
        { id: 'pdf', icon: File, label: 'PDF', sub: 'Document', color: 'rose' },
        { id: 'xlsx', icon: FileSpreadsheet, label: 'Excel', sub: 'Microsoft', color: 'cyan' },
    ];

    const handleDataSourceChange = (sourceId) => {
        setDataSource(sourceId);
        setSelectedColumns(columnOptions[sourceId].map(c => c.id));
    };

    const toggleColumn = (colId) => {
        setSelectedColumns(prev =>
            prev.includes(colId)
                ? prev.filter(c => c !== colId)
                : [...prev, colId]
        );
    };

    const selectAllColumns = () => {
        setSelectedColumns(columnOptions[dataSource].map(c => c.id));
    };

    const deselectAllColumns = () => {
        setSelectedColumns([]);
    };

    const generateExport = async () => {
        if (selectedColumns.length === 0) {
            toast.error('Please select at least one column');
            return;
        }

        setIsExporting(true);
        try {
            let exportData = [];
            let filename = '';

            const filterByDate = (item, dateField = 'createdAt') => {
                if (!dateRange.start && !dateRange.end) return true;
                const itemDate = new Date(item[dateField]);
                if (dateRange.start && itemDate < new Date(dateRange.start)) return false;
                if (dateRange.end && itemDate > new Date(dateRange.end)) return false;
                return true;
            };

            switch (dataSource) {
                case 'products':
                    const products = (productsData?.products || []).filter(p => filterByDate(p));
                    exportData = products.map(p => {
                        const row = {};
                        selectedColumns.forEach(col => {
                            switch (col) {
                                case 'productName': row['Product Name'] = p.productName || ''; break;
                                case 'skuId': row['SKU / Barcode'] = p.skuId || p.barcodeEAN || ''; break;
                                case 'initialQty': row['Stock Quantity'] = p.initialQty || 0; break;
                                case 'category': {
                                    let catValue = '';
                                    if (Array.isArray(p.category) && p.category.length > 0) {
                                        catValue = p.category.map(c => (typeof c === 'object' ? c.catName : c)).filter(Boolean).join(', ');
                                    } else if (typeof p.category === 'string') {
                                        catValue = p.category;
                                    }
                                    row['Category'] = catValue || 'General';
                                    break;
                                }
                                case 'costPrice': row['Cost Price'] = p.costPrice || 0; break;
                                case 'basePrice': row['Selling Price'] = p.basePrice || 0; break;
                                case 'supplier': row['Supplier'] = p.supplier?.company || ''; break;
                                case 'createdAt': row['Created At'] = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''; break;
                            }
                        });
                        return row;
                    });
                    filename = `inventory_export_${new Date().toISOString().split('T')[0]}`;
                    break;

                case 'sales':
                    const sales = (Array.isArray(salesOrdersData?.orders) ? salesOrdersData.orders :
                        Array.isArray(salesOrdersData) ? salesOrdersData : []).filter(o => filterByDate(o));
                    exportData = sales.map(o => {
                        const row = {};
                        selectedColumns.forEach(col => {
                            switch (col) {
                                case 'orderNumber': row['Order Number'] = o.orderNumber || ''; break;
                                case 'customer': row['Customer'] = o.customer?.name || ''; break;
                                case 'items': row['Items'] = o.items?.length || 0; break;
                                case 'subtotal': row['Subtotal'] = o.subtotal || 0; break;
                                case 'taxAmount': row['Tax'] = o.taxAmount || 0; break;
                                case 'total': row['Total'] = o.total || 0; break;
                                case 'paymentStatus': row['Payment Status'] = o.paymentStatus || ''; break;
                                case 'orderStatus': row['Order Status'] = o.orderStatus || ''; break;
                                case 'createdAt': row['Created At'] = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''; break;
                            }
                        });
                        return row;
                    });
                    filename = `sales_export_${new Date().toISOString().split('T')[0]}`;
                    break;

                case 'suppliers':
                    const suppliers = (vendorsData?.suppliers || []);
                    exportData = suppliers.map(s => {
                        const row = {};
                        selectedColumns.forEach(col => {
                            switch (col) {
                                case 'company': row['Company'] = s.company || ''; break;
                                case 'code': row['Code'] = s.code || ''; break;
                                case 'email': row['Email'] = s.email || ''; break;
                                case 'phone': row['Phone'] = s.phone || ''; break;
                                case 'location': row['Location'] = s.location || ''; break;
                                case 'status': row['Status'] = s.status || ''; break;
                                case 'reliability': row['Reliability'] = s.reliability || 0; break;
                            }
                        });
                        return row;
                    });
                    filename = `suppliers_export_${new Date().toISOString().split('T')[0]}`;
                    break;

                case 'orders':
                    const orders = (Array.isArray(ordersData?.orders) ? ordersData.orders :
                        Array.isArray(ordersData) ? ordersData : []).filter(o => filterByDate(o));
                    exportData = orders.map(o => {
                        const row = {};
                        selectedColumns.forEach(col => {
                            switch (col) {
                                case 'orderNumber': row['Order Number'] = o.orderId || o.orderNumber || ''; break;
                                case 'customer': row['Customer'] = o.entity || o.customer?.name || ''; break;
                                case 'type': row['Type'] = o.type || ''; break;
                                case 'status': row['Status'] = o.status || ''; break;
                                case 'value': row['Value'] = o.value || 0; break;
                                case 'paymentStatus': row['Payment Status'] = o.paymentStatus || 'N/A'; break;
                                case 'createdAt': row['Created At'] = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''; break;
                            }
                        });
                        return row;
                    });
                    filename = `operations_export_${new Date().toISOString().split('T')[0]}`;
                    break;

                case 'activities':
                    const activities = (activitiesData?.activities || []).filter(a => filterByDate(a));
                    exportData = activities.map(a => {
                        const row = {};
                        selectedColumns.forEach(col => {
                            switch (col) {
                                case 'action': row['Action'] = a.action || ''; break;
                                case 'module': row['Module'] = a.module || ''; break;
                                case 'user': row['User'] = a.userId?.fullName || 'System'; break;
                                case 'ipAddress': row['IP Address'] = a.ipAddress || ''; break;
                                case 'createdAt': row['Date'] = a.createdAt ? new Date(a.createdAt).toLocaleString() : ''; break;
                            }
                        });
                        return row;
                    });
                    filename = `audit_logs_export_${new Date().toISOString().split('T')[0]}`;
                    break;
            }

            if (exportData.length === 0) {
                toast.error('No data available to export');
                setIsExporting(false);
                return;
            }

            const downloadFile = (content, ext, type) => {
                const blob = new Blob([content], { type });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${filename}.${ext}`;
                link.click();
                URL.revokeObjectURL(link.href);
            };

            if (exportFormat === 'csv') {
                const headers = Object.keys(exportData[0] || {});
                const csvContent = [
                    headers.join(','),
                    ...exportData.map(row => headers.map(h => {
                        const val = String(row[h] || '');
                        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
                    }).join(','))
                ].join('\n');
                downloadFile(csvContent, 'csv', 'text/csv;charset=utf-8;');
            } else if (exportFormat === 'xlsx') {
                const headers = Object.keys(exportData[0] || {});
                let xlsContent = headers.join('\t') + '\n';
                exportData.forEach(row => {
                    xlsContent += headers.map(h => row[h] || '').join('\t') + '\n';
                });
                downloadFile(xlsContent, 'xls', 'application/vnd.ms-excel');
            } else if (exportFormat === 'pdf') {
                const printWindow = window.open('', '_blank');
                const tableRows = exportData.map(row =>
                    `<tr>${Object.values(row).map(v => `<td style="padding:8px;border:1px solid #ddd;">${v}</td>`).join('')}</tr>`
                ).join('');

                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${filename}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #333; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th { background: #4f46e5; color: white; padding: 12px; text-align: left; }
                            td { padding: 10px; border: 1px solid #ddd; }
                            .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <h1>${dataSourceLabels[dataSource]} Report</h1>
                        <p class="meta">Generated: ${new Date().toLocaleDateString()} | Records: ${exportData.length}</p>
                        <table>
                            <thead><tr>${Object.keys(exportData[0] || {}).map(h => `<th>${h}</th>`).join('')}</tr></thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                setTimeout(() => printWindow.print(), 500);
            }

            try {
                await logDownload({
                    reportType: dataSourceLabels[dataSource],
                    format: exportFormat.toUpperCase(),
                    recordCount: exportData.length,
                    fileName: `${filename}.${exportFormat}`
                }).unwrap();
                refetchExports();
            } catch (logError) {
                console.warn('Failed to log export:', logError);
            }

            toast.success(`Export successful: ${exportData.length} records`);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Export failed: ' + (error.message || 'Unknown error'));
        } finally {
            setIsExporting(false);
        }
    };

    const recentExports = recentExportsData?.exports?.slice(0, 5).map((exp, idx) => ({
        id: idx,
        name: exp.fileName || `${exp.reportType}_export.${exp.format?.toLowerCase()}`,
        date: exp.createdAt ? new Date(exp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        size: exp.fileSize || `${Math.round((exp.recordCount || 0) * 0.5)} KB`,
        type: exp.format?.toLowerCase() || 'csv'
    })) || [
            { id: 1, name: 'No exports yet', date: '', size: '', type: 'csv' }
        ];

    // Real-time Calculators for Quick Reports
    const salesTotal = (salesOrdersData?.orders || []).reduce((s, o) => s + (o.total || 0), 0);
    const purchaseTotal = (Array.isArray(posData?.orders) ? posData.orders : Array.isArray(posData) ? posData : []).reduce((s, o) => s + (o.total || 0), 0);
    const lowStockCount = (productsData?.products || []).filter(p => p.status === 'low stock' || p.status === 'out of stock').length;
    const inventoryValuation = (productsData?.products || []).reduce((s, p) => s + (p.initialQty * (p.basePrice || 0)), 0);

    const reportCategories = [
        {
            name: 'Financial Reports',
            icon: BarChart,
            items: [
                { label: 'Sales Performance', path: '/sales-performance', desc: 'Revenue analytics', value: `$${salesTotal.toLocaleString()}` },
                { label: 'Profit & Loss', path: '/profit-loss', desc: 'Financial margins', value: `Live` },
                { label: 'Vendor Performance', path: '/vendor-performance', desc: 'Supplier metrics', value: `$${purchaseTotal.toLocaleString()}` }
            ]
        },
        {
            name: 'Inventory Insights',
            icon: Layers,
            items: [
                { label: 'Stock Movement', path: '/stock-movement', desc: 'Inventory changes', value: `${lowStockCount} Alerts` },
                { label: 'Inventory Valuation', path: '/inventory-valuation', desc: 'Value breakdown', value: `$${(inventoryValuation / 1000).toFixed(1)}k` }
            ]
        }
    ];

    const getRecordCount = () => {
        switch (dataSource) {
            case 'products': return productsData?.products?.length || 0;
            case 'sales': return Array.isArray(salesOrdersData?.orders) ? salesOrdersData.orders.length : 0;
            case 'suppliers': return vendorsData?.suppliers?.length || 0;
            case 'orders': return Array.isArray(ordersData?.orders) ? ordersData.orders.length : 0;
            case 'activities': return activitiesData?.activities?.length || 0;
            default: return 0;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Reports & Export</h2>
                    <p className="text-slate-400 text-sm mt-1">Generate and export data in multiple formats</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-6 bg-purple-500 rounded-full" />
                                <h3 className="text-lg font-bold text-white">Export Configuration</h3>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                                <Database className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-400">{getRecordCount()} records</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Data Source</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {dataSources.map(ds => (
                                        <button
                                            key={ds.id}
                                            onClick={() => handleDataSourceChange(ds.id)}
                                            className={clsx(
                                                "flex flex-col items-start p-3 rounded-xl border transition-all",
                                                dataSource === ds.id
                                                    ? "bg-purple-500/10 border-purple-500"
                                                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                            )}
                                        >
                                            <ds.icon className={clsx("w-5 h-5 mb-1", dataSource === ds.id ? "text-purple-400" : "text-slate-500")} />
                                            <span className={clsx("text-sm font-medium", dataSource === ds.id ? "text-white" : "text-slate-400")}>{ds.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Date Range (Optional)</label>
                                <div className="flex items-center gap-2 h-[94px]">
                                    <div className="relative flex-1 h-full">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                            className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-white text-sm"
                                        />
                                    </div>
                                    <span className="text-slate-600">-</span>
                                    <div className="relative flex-1 h-full">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                            className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-white text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Export Format</label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {exportFormats.map(fmt => (
                                    <button
                                        key={fmt.id}
                                        onClick={() => setExportFormat(fmt.id)}
                                        className={clsx(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group",
                                            exportFormat === fmt.id
                                                ? `bg-${fmt.color}-500/10 border-${fmt.color}-500`
                                                : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                        )}
                                    >
                                        <fmt.icon className={clsx("w-6 h-6 mb-1.5", exportFormat === fmt.id ? `text-${fmt.color}-400` : "text-slate-600")} />
                                        <span className={clsx("font-bold text-sm", exportFormat === fmt.id ? "text-white" : "text-slate-400")}>{fmt.label}</span>
                                        <span className="text-[9px] text-slate-600">{fmt.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Columns to Include</label>
                                <div className="flex gap-2">
                                    <button onClick={selectAllColumns} className="text-xs text-purple-400 hover:text-purple-300 font-medium">Select All</button>
                                    <span className="text-slate-600">|</span>
                                    <button onClick={deselectAllColumns} className="text-xs text-slate-500 hover:text-slate-400 font-medium">Clear</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {columnOptions[dataSource].map(col => (
                                    <label
                                        key={col.id}
                                        className={clsx(
                                            "flex items-center gap-2 bg-slate-950 border p-2.5 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors",
                                            selectedColumns.includes(col.id)
                                                ? "border-purple-500/50 bg-purple-500/5"
                                                : "border-slate-800"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                "w-4 h-4 rounded flex items-center justify-center transition-all",
                                                selectedColumns.includes(col.id)
                                                    ? "bg-purple-500"
                                                    : "border border-slate-700"
                                            )}
                                        >
                                            {selectedColumns.includes(col.id) && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-xs text-slate-300 truncate">{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={generateExport}
                            disabled={isExporting || selectedColumns.length === 0}
                            className="w-full bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Generate & Download Report
                                </>
                            )}
                        </button>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
                        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            Recent Exports
                        </h3>
                        <div className="space-y-3">
                            {recentExports.map((exp) => (
                                <div key={exp.id} className="p-3 bg-slate-950/50 border border-slate-800/50 rounded-lg hover:border-slate-700 transition-all group flex items-center gap-3">
                                    <div className={clsx(
                                        "w-9 h-9 rounded-lg flex items-center justify-center",
                                        exp.type === 'pdf' ? "bg-rose-500/10 text-rose-400" :
                                            exp.type === 'xlsx' ? "bg-cyan-500/10 text-cyan-400" :
                                                "bg-emerald-500/10 text-emerald-400"
                                    )}>
                                        {exp.type === 'pdf' ? <File className="w-4 h-4" /> :
                                            exp.type === 'xlsx' ? <FileSpreadsheet className="w-4 h-4" /> :
                                                <FileText className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{exp.name}</p>
                                        {exp.date && <p className="text-[11px] text-slate-500">{exp.date} • {exp.size}</p>}
                                    </div>
                                </div>
                            ))}
                            {recentExportsData?.exports?.length > 5 && (
                                <button className="w-full py-2 text-xs text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider transition-colors">
                                    View All History
                                </button>
                            )}
                        </div>
                    </section>

                    <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
                        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-cyan-400" />
                            Quick Reports
                        </h3>
                        <div className="space-y-2">
                            {reportCategories.map((category, catIdx) => (
                                <div key={catIdx} className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        <category.icon className="w-3 h-3" />
                                        {category.name}
                                    </div>
                                    {category.items.map((item, itemIdx) => (
                                        <button
                                            key={itemIdx}
                                            onClick={() => navigate(item.path)}
                                            className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-white text-xs font-bold group-hover:text-purple-400 transition-colors">{item.label}</span>
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-all uppercase tracking-tighter">
                                                    {item.value}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-[10px]">{item.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-liner-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-white mb-2">Schedule Automated Reports</h3>
                        <p className="text-xs text-slate-400 mb-3">Get recurring exports delivered to your email</p>
                        <button
                            onClick={() => navigate('/settings')}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Configure Schedules
                        </button>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default Reports;