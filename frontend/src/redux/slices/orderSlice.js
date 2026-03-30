import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: serverUrl + '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders/all',
        params,
      }),
      providesTags: (result) =>
        result?.orders
          ? [
            ...result.orders.map(({ _id }) => ({ type: 'Order', id: _id })),
            { type: 'Order', id: 'LIST' },
          ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders/add',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/update/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Order', id: 'LIST' }],
    }),
    generateInvoice: builder.query({
      query: (id) => ({
        url: `/orders/invoice/${id}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    cart: [],
    filters: {
      status: '',
      startDate: '',
      endDate: '',
      search: '',
      type: '',
      page: 1,
    },
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cart.find(
        (item) => item.productId === action.payload.productId
      )
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.cart.push(action.payload)
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      )
    },
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.cart.find((item) => item.productId === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart: (state) => {
      state.cart = []
    },
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetOrderFilters: (state) => {
      state.filters = {
        status: '',
        startDate: '',
        endDate: '',
        search: '',
        type: '',
        page: 1,
      }
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setOrderFilters,
  resetOrderFilters,
} = orderSlice.actions

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGenerateInvoiceQuery,
} = orderApi

export default orderSlice.reducer

// Selectors
export const selectCart = (state) => state.orders.cart
export const selectCartTotal = (state) =>
  state.orders.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
export const selectCartItemCount = (state) =>
  state.orders.cart.reduce((count, item) => count + item.quantity, 0)
export const selectOrderFilters = (state) => state.orders.filters
