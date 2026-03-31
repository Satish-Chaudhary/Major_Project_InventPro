import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    selectCart,
    selectCartTotal,
    selectCartCount,
    removeFromCart,
    updateQuantity,
    clearCart
} from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const cartItems = useAppSelector(selectCart);
    const totalAmount = useAppSelector(selectCartTotal);
    const totalQuantity = useAppSelector(selectCartCount);

    const handleQuantityChange = (productId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty >= 1) {
            dispatch(updateQuantity({ productId, quantity: newQty }));
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
        toast.success('Item removed from cart');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700/50">
                    <FiShoppingBag className="text-4xl text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                <p className="text-slate-400 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our products and start adding items.</p>
                <Link
                    to="/inventory"
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Shopping Cart</h1>
                    <p className="text-slate-400 mt-1">You have {totalQuantity} items in your cart</p>
                </div>
                <button
                    onClick={() => dispatch(clearCart())}
                    className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.productId} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center gap-6 group hover:border-slate-700 transition-all">
                            <div className="w-24 h-24 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-slate-700 flex items-center justify-center text-slate-500 italic text-xs">
                                {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" /> : "No Image"}
                            </div>

                            <div className="grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{item.productName}</h3>
                                        <p className="text-slate-500 text-sm">SKU: {item.sku}</p>
                                    </div>
                                    <p className="text-xl font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                                        <button
                                            onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                                            className="p-1 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <FiMinus size={18} />
                                        </button>
                                        <span className="w-12 text-center text-white font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                                            className="p-1 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <FiPlus size={18} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Shipping</span>
                                <span className="text-green-400 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax (GST 18%)</span>
                                <span className="text-white font-medium">${(totalAmount * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-slate-800 my-2"></div>
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span className="text-indigo-400">${(totalAmount * 1.18).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20"
                        >
                            Proceed to Checkout
                            <FiArrowRight />
                        </button>

                        <p className="text-slate-500 text-xs text-center mt-6">
                            Secure checkout powered by Razorpay & Stripe.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
