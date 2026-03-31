import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectCart, selectCartTotal, clearCart } from '../redux/slices/cartSlice';
import { useCreateSalesOrderMutation } from '../redux/slices/salesOrderSlice';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '../redux/slices/paymentSlice';
import { useGetCustomersQuery } from '../redux/slices/customerSlice';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiCreditCard, FiCheckCircle, FiArrowRight, FiArrowLeft, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cartItems = useAppSelector(selectCart);
    const totalAmount = useAppSelector(selectCartTotal);

    const [step, setStep] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });
    const [paymentGateway, setPaymentGateway] = useState('razorpay');
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: customersData, isLoading: customersLoading } = useGetCustomersQuery({ search: customerSearch });
    const [createOrder] = useCreateSalesOrderMutation();
    const [createPaymentIntent] = useCreatePaymentIntentMutation();
    const [confirmPayment] = useConfirmPaymentMutation();

    const taxAmount = totalAmount * 0.18;
    const finalAmount = totalAmount + taxAmount;

    useEffect(() => {
        if (cartItems.length === 0 && step !== 4) {
            navigate('/cart');
        }
    }, [cartItems, navigate, step]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handlePlaceOrder = async () => {
        if (!selectedCustomer) {
            toast.error('Please select a customer');
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Create Sales Order
            const orderPayload = {
                customer: selectedCustomer._id,
                items: cartItems.map(item => ({
                    product: item.productId,
                    productName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    total: item.price * item.quantity
                })),
                subtotal: totalAmount,
                taxAmount: taxAmount,
                total: finalAmount,
                shippingAddress: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}, ${shippingAddress.country}`,
                paymentStatus: 'pending',
                orderStatus: 'confirmed',
                paymentMethod: 'card',
                paymentGateway: paymentGateway
            };

            const orderResponse = await createOrder(orderPayload).unwrap();
            const orderId = orderResponse.salesOrder._id;

            // 2. Create Payment Intent
            const intentResponse = await createPaymentIntent({
                orderId,
                gateway: paymentGateway
            }).unwrap();

            // 3. Simulate Payment (Normally you would open Razorpay/Stripe UI here)
            toast.loading(`Processing ${paymentGateway} payment...`, { id: 'payment' });

            setTimeout(async () => {
                try {
                    await confirmPayment({
                        orderId,
                        transactionId: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        amount: finalAmount,
                        paymentMethod: 'card',
                        gateway: paymentGateway
                    }).unwrap();

                    toast.success('Order placed successfully!', { id: 'payment' });
                    setStep(4);
                    dispatch(clearCart());
                } catch (err) {
                    toast.error('Payment confirmation failed', { id: 'payment' });
                } finally {
                    setIsProcessing(false);
                }
            }, 2000);

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.data?.message || 'Something went wrong during checkout');
            setIsProcessing(false);
        }
    };

    const steps = [
        { id: 1, name: 'Customer', icon: <FiUser /> },
        { id: 2, name: 'Shipping', icon: <FiMapPin /> },
        { id: 3, name: 'Payment', icon: <FiCreditCard /> },
        { id: 4, name: 'Complete', icon: <FiCheckCircle /> },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Multi-step indicator */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border-slate-700 text-slate-500'
                            }`}>
                            {s.icon}
                        </div>
                        <span className={`text-xs font-bold mt-2 uppercase tracking-tighter ${step >= s.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                            {s.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-white mb-6">Select Customer</h2>
                        <div className="relative mb-6">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={customerSearch}
                                onChange={(e) => setCustomerSearch(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto mb-8 custom-scrollbar">
                            {customersLoading ? (
                                <div className="text-slate-500 text-center py-4">Loading customers...</div>
                            ) : (
                                customersData?.customers?.map(c => (
                                    <button
                                        key={c._id}
                                        onClick={() => setSelectedCustomer(c)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedCustomer?._id === c._id ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <p className="font-bold">{c.name}</p>
                                            <p className="text-xs opacity-60">{c.email}</p>
                                        </div>
                                        {selectedCustomer?._id === c._id && <FiCheckCircle />}
                                    </button>
                                ))
                            )}
                        </div>

                        <button
                            disabled={!selectedCustomer}
                            onClick={handleNext}
                            className="w-full bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            Next: Shipping Details <FiArrowRight />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Street Address</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={shippingAddress.street}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Zip Code</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={shippingAddress.zipCode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 border border-slate-700 text-slate-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                <FiArrowLeft /> Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                            >
                                Next: Payment <FiArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setPaymentGateway('razorpay')}
                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${paymentGateway === 'razorpay' ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-800 border-slate-700 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                                    }`}
                            >
                                <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-10 h-10 object-contain" />
                                <span className="font-bold text-white">Razorpay</span>
                            </button>
                            <button
                                onClick={() => setPaymentGateway('stripe')}
                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${paymentGateway === 'stripe' ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-800 border-slate-700 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                                    }`}
                            >
                                <img src="https://stripe.com/favicon.ico" alt="Stripe" className="w-10 h-10 object-contain" />
                                <span className="font-bold text-white">Stripe</span>
                            </button>
                        </div>

                        <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400">Order Total</span>
                                <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400">Tax (18% GST)</span>
                                <span className="text-white font-medium">${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-slate-700 my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Final Amount</span>
                                <span className="text-2xl font-black text-indigo-400">${finalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 border border-slate-700 text-slate-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                <FiArrowLeft /> Back
                            </button>
                            <button
                                disabled={isProcessing}
                                onClick={handlePlaceOrder}
                                className="flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                {isProcessing ? 'Processing...' : `Pay $${finalAmount.toFixed(2)}`} <FiArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in zoom-in duration-700 flex flex-col items-center py-12 text-center">
                        <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 border-4 border-green-500/20">
                            <FiCheckCircle size={48} className="animate-bounce" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Order Confirmed!</h2>
                        <p className="text-slate-400 mb-10 max-w-sm">
                            Thank you for your purchase. We've received your payment and our warehouse team is starting to process your order.
                        </p>
                        <div className="flex gap-4 w-full max-w-sm">
                            <button
                                onClick={() => navigate('/orders')}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
                            >
                                View Orders
                            </button>
                            <button
                                onClick={() => navigate('/inventory')}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
