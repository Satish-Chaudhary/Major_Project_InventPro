import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
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
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/create-intent',
        method: 'POST',
        body: data,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment', 'SalesOrder'],
    }),
  }),
})

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = paymentApi
