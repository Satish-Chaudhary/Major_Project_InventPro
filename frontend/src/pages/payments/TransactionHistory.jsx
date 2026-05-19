import React from 'react';
import { useGetPaymentHistoryQuery } from '../../redux/slices/paymentSlice';
import { Link } from 'react-router-dom';

const TransactionHistory = () => {
  const { data, isLoading, error } = useGetPaymentHistoryQuery();

  if (isLoading) return <div className="p-8 text-center">Loading transactions...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Failed to load transactions.</div>;

  const transactions = data?.data || [];

  return (
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transaction History</h1>
          <p className="text-slate-400 mt-1">Review your past payments and transaction details</p>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center text-slate-500 italic shadow-2xl">
          No transactions found.
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/20 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Transaction ID</th>
                  <th className="px-8 py-5">Invoice</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6 text-sm text-slate-400">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-sm font-mono text-slate-400">
                      {txn.razorpayPaymentId || 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      <Link to={`/payments/invoice/${txn.invoiceId?._id || txn.invoiceId}`}>
                        {txn.invoiceId?.invoiceNumber || txn.invoiceId}
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-white font-black">₹{txn.amount}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                        ${txn.status === 'captured' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                          txn.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          txn.status === 'refunded' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-sm font-medium">
                      {txn.status === 'captured' && (
                        <Link to={`/payments/invoice/${txn.invoiceId?._id || txn.invoiceId}`} className="text-blue-400 hover:text-blue-300 uppercase tracking-widest text-[10px] font-bold">
                          View Invoice
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
