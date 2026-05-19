import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createSlice } from '@reduxjs/toolkit'
import { serverUrl } from '../../config/api.js'

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: serverUrl + '/api/payments',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: '/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    getPaymentHistory: builder.query({
      query: () => '/history',
      providesTags: ['Payment'],
    }),
    processRefund: builder.mutation({
      query: (data) => ({
        url: '/refund',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    getInvoice: builder.query({
      query: (id) => `/invoice/${id}`,
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPaymentHistoryQuery,
  useProcessRefundMutation,
  useGetInvoiceQuery,
} = paymentApi

// Payment State Slice
const initialState = {
  loading: false,
  paymentStatus: 'idle',
  transaction: null,
  error: null
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentLoading: (state, action) => {
      state.loading = action.payload
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload
    },
    setTransaction: (state, action) => {
      state.transaction = action.payload
    },
    setPaymentError: (state, action) => {
      state.error = action.payload
    },
    resetPaymentState: () => initialState
  }
})

export const { 
  setPaymentLoading, 
  setPaymentStatus, 
  setTransaction, 
  setPaymentError, 
  resetPaymentState 
} = paymentSlice.actions

export default paymentSlice.reducer
