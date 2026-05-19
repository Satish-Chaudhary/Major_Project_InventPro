import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reason } = location.state || {};

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-500/10 p-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <XCircle className="text-red-400 w-16 h-16" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Payment Failed</h2>
        <p className="text-slate-400 mb-6 text-sm">
          We couldn't process your payment at this time.
        </p>
        
        {reason && (
          <div className="bg-red-500/10 text-red-400 rounded-xl p-4 mb-6 text-sm text-left border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Reason:</span>
            {reason}
          </div>
        )}

        <div className="bg-slate-800/30 rounded-xl p-4 mb-6 text-sm text-left text-slate-400 border border-slate-800/50">
          If money was deducted from your account, it will be refunded automatically within 5-7 business days.
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate(-1)} // Go back to try again
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[11px] py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            Retry Payment
          </button>
          <button 
            onClick={() => navigate('/support')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-widest text-[11px] py-3 px-4 rounded-xl transition-all border border-slate-700"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
