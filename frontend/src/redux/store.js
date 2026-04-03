import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import productReducer, { productApi } from './slices/productSlice'
import orderReducer, { orderApi } from './slices/orderSlice'
import vendorReducer, { vendorApi } from './slices/vendorSlice'
import categoryReducer, { categoryApi } from './slices/categorySlice'
import { reportApi } from './slices/reportSlice'
import { activityApi } from './slices/activitySlice'
import { adminApi } from './slices/adminSlice'
import { notificationApi } from './slices/notificationSlice'
import { settingsApi } from './slices/settingsSlice'
import { customerApi } from './slices/customerSlice'
import { salesOrderApi } from './slices/salesOrderSlice'
import { invoiceApi } from './slices/invoiceSlice'
import { paymentApi } from './slices/paymentSlice'
import { purchaseOrderApi } from './slices/purchaseOrderSlice'
import cartReducer from './slices/cartSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui', 'cart'], // Only persist auth, UI, and cart
}

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  products: productReducer,
  orders: orderReducer,
  vendors: vendorReducer,
  categories: categoryReducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [vendorApi.reducerPath]: vendorApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  [activityApi.reducerPath]: activityApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [salesOrderApi.reducerPath]: salesOrderApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [purchaseOrderApi.reducerPath]: purchaseOrderApi.reducer,
  cart: cartReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      productApi.middleware,
      orderApi.middleware,
      vendorApi.middleware,
      categoryApi.middleware,
      reportApi.middleware,
      activityApi.middleware,
      adminApi.middleware,
      notificationApi.middleware,
      settingsApi.middleware,
      customerApi.middleware,
      salesOrderApi.middleware,
      invoiceApi.middleware,
      paymentApi.middleware,
      purchaseOrderApi.middleware
    ),
})

export const persistor = persistStore(store);
