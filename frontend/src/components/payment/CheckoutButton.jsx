import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRazorpayScript } from '../../utils/razorpayLoader';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '../../redux/slices/paymentSlice';
import { useDispatch } from 'react-redux';
import { setPaymentLoading, setPaymentStatus, setTransaction, setPaymentError } from '../../redux/slices/paymentSlice';

const CheckoutButton = ({ invoiceId, amount, currency = "INR", label = "Pay Now" }) => {
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      dispatch(setPaymentLoading(true));
      dispatch(setPaymentStatus('processing'));

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        dispatch(setPaymentLoading(false));
        return;
      }

      const orderResponse = await createOrder({ invoiceId, amount, currency }).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "InventPro",
        description: `Payment for Invoice ${invoiceId}`,
        order_id: orderResponse.order.id,
        handler: async function (response) {
          try {
            dispatch(setPaymentStatus('verifying'));
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            if (verifyResponse.success) {
              dispatch(setPaymentStatus('success'));
              dispatch(setTransaction(verifyResponse));
              navigate('/payments/success', { state: { transactionId: response.razorpay_payment_id, invoiceId, amount } });
            }
          } catch (error) {
            console.error('Verification failed:', error);
            dispatch(setPaymentStatus('failed'));
            dispatch(setPaymentError(error.data?.message || 'Verification failed'));
            navigate('/payments/failed', { state: { reason: error.data?.message || 'Verification failed' } });
          }
        },
        prefill: {
          name: "InventPro User",
          email: "user@inventpro.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            dispatch(setPaymentLoading(false));
            dispatch(setPaymentStatus('cancelled'));
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Order creation failed:', error);
      setIsProcessing(false);
      dispatch(setPaymentLoading(false));
      dispatch(setPaymentStatus('failed'));
      dispatch(setPaymentError(error.data?.message || 'Order creation failed'));
      navigate('/payments/failed', { state: { reason: error.data?.message || 'Order creation failed' } });
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 ${isProcessing ? 'bg-blue-600/50 text-white/50 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
        }`}
    >
      {isProcessing ? 'Processing...' : label}
    </button>
  );
};

export default CheckoutButton;
