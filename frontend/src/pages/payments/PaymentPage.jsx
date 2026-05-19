import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CheckoutButton from '../../components/payment/CheckoutButton';
import { useSelector } from 'react-redux';
import { useGetInvoiceQuery } from '../../redux/slices/paymentSlice';

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: invoiceData, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId);
  const invoice = invoiceData?.data;

  // Use dynamically fetched amount, fallback to state if still loading
  const amount = invoice?.total || location.state?.amount || 0; 
  
  const { paymentStatus, loading } = useSelector((state) => state.payment);

  useEffect(() => {
      // If invoice is already paid, redirect to history or success
      if (invoice && invoice.status === 'paid' && paymentStatus !== 'success') {
          navigate('/payments/history');
      }
  }, [invoice, navigate, paymentStatus]);

  if (isInvoiceLoading && !amount) {
      return (
          <div className="min-h-[80vh] flex items-center justify-center p-4">
              <div className="text-blue-400 font-bold tracking-widest uppercase animate-pulse">Loading Invoice Details...</div>
          </div>
      );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-6 border-b border-slate-800 pb-4">Complete Payment</h2>
        
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-sm font-medium">Invoice Number</span>
            <span className="font-bold text-white tracking-tight">{invoice?.invoiceNumber || invoiceId}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-sm font-medium">Currency</span>
            <span className="font-bold text-white tracking-tight">INR</span>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold border-t border-slate-800 pt-4">
            <span className="text-slate-300">Total Amount</span>
            <span className="text-blue-400 font-black">₹{amount}</span>
          </div>
        </div>

        <div className="space-y-4">
          {paymentStatus === 'processing' && (
             <div className="text-blue-400 text-sm text-center font-bold tracking-widest uppercase animate-pulse">
               Initializing secure gateway...
             </div>
          )}
          {paymentStatus === 'verifying' && (
             <div className="text-blue-400 text-sm text-center font-bold tracking-widest uppercase animate-pulse">
               Verifying transaction securely...
             </div>
          )}

          <CheckoutButton invoiceId={invoiceId} amount={amount} currency="INR" label="Pay Securely with Razorpay" />

          <p className="text-[10px] uppercase tracking-widest text-slate-500 text-center mt-4 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            100% Secure Payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
