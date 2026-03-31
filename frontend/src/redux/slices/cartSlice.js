import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // [{ productId, productName, sku, price, quantity, image }]
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.productId === newItem.productId);
            
            if (!existingItem) {
                state.items.push({
                    productId: newItem.productId,
                    productName: newItem.productName,
                    sku: newItem.sku,
                    price: newItem.price,
                    quantity: newItem.quantity || 1,
                    image: newItem.image
                });
            } else {
                existingItem.quantity += (newItem.quantity || 1);
            }
            
            state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.productId !== id);
            
            state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity = Math.max(1, quantity);
            }
            
            state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
            state.totalAmount = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        }
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCart = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartCount = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
