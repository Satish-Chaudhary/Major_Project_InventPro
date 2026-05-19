import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId, invoiceId, amount } = location.state || {};

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-500/10 p-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <CheckCircle className="text-green-400 w-16 h-16" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Payment Successful!</h2>
        <p className="text-slate-400 mb-6 text-sm">Your transaction was completed successfully.</p>
        
        <div className="bg-slate-800/30 border border-slate-800/50 rounded-xl p-5 mb-6 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Transaction ID</span>
            <span className="font-mono text-slate-300 text-sm">{transactionId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Invoice ID</span>
            <span className="font-bold text-white tracking-tight text-sm">{invoiceId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-800/50 pt-3">
            <span className="text-slate-300 text-sm font-semibold">Amount Paid</span>
            <span className="text-green-400 font-black text-lg">₹{amount || '0'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate(`/payments/invoice/${invoiceId}`)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[11px] py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            Download Invoice
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-[11px] py-3 px-4 rounded-xl transition-all border border-slate-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
