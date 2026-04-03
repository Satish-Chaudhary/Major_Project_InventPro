import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Check, AlertCircle, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useBulkImportMutation } from '../redux/slices/productSlice.js';
import { exportToCSV } from '../utils/exportUtils';

const BulkImportModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [step, setStep] = useState('upload'); // upload, preview, importing, done
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const [importProducts] = useBulkImportMutation();

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const product = {};

      headers.forEach((header, idx) => {
        product[header] = values[idx] || '';
      });

      if (product.productname || product.skuId) {
        products.push(product);
      }
    }

    return products;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        toast.error('No valid products found in CSV');
        return;
      }

      setFile(selectedFile);
      setPreview(parsed);
      setStep('preview');
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    setStep('importing');

    try {
      const res = await importProducts({ products: preview }).unwrap();
      setResults(res.results);
      setStep('done');
      toast.success(`Imported ${res.results.created.length} products`);
    } catch (error) {
      toast.error('Import failed: ' + (error.message || 'Unknown error'));
      setStep('preview');
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['productName', 'skuId', 'category', 'brand', 'initialQty', 'lowStockThreshold', 'basePrice', 'costPrice', 'tax', 'productDescription'],
      ['Sample Product', 'SKU001', 'Electronics', 'BrandX', '100', '10', '99.99', '50', '10', 'Product description']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
  };

  const resetModal = () => {
    setFile(null);
    setPreview([]);
    setStep('upload');
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">Bulk Import Products</h3>
              <button onClick={handleClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {step === 'upload' && (
                <div className="space-y-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Click to upload CSV file</p>
                    <p className="text-slate-500 text-sm">Supports .csv files with product data</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV Template
                  </button>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{file?.name}</p>
                      <p className="text-slate-500 text-sm">{preview.length} products found</p>
                    </div>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Product Name</th>
                          <th className="px-4 py-3 text-left">SKU</th>
                          <th className="px-4 py-3 text-left">Qty</th>
                          <th className="px-4 py-3 text-left">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {preview.slice(0, 10).map((p, i) => (
                          <tr key={i} className="text-slate-300">
                            <td className="px-4 py-2">{p.productName}</td>
                            <td className="px-4 py-2 font-mono text-xs">{p.skuId}</td>
                            <td className="px-4 py-2">{p.initialQty}</td>
                            <td className="px-4 py-2">${p.basePrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {preview.length > 10 && (
                      <div className="p-3 text-center text-slate-500 text-sm bg-slate-800/30">
                        ... and {preview.length - 10} more products
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 'importing' && (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">Importing products...</p>
                </div>
              )}

              {step === 'done' && results && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                      <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-emerald-400 font-bold text-lg">{results.created.length}</p>
                      <p className="text-slate-500 text-xs">Created</p>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                      <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                      <p className="text-amber-400 font-bold text-lg">{results.skipped.length}</p>
                      <p className="text-slate-500 text-xs">Skipped</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                      <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <p className="text-red-400 font-bold text-lg">{results.errors.length}</p>
                      <p className="text-slate-500 text-xs">Errors</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-between">
              {step === 'preview' && (
                <>
                  <button
                    onClick={resetModal}
                    className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
                  >
                    Import {preview.length} Products
                  </button>
                </>
              )}
              {step === 'done' && (
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkImportModal;