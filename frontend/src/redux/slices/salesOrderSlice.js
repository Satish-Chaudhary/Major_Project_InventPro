import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const salesOrderApi = createApi({
  reducerPath: 'salesOrderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: serverUrl + '/api/sales-orders',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['SalesOrder'],
  endpoints: (builder) => ({
    getSalesOrders: builder.query({
      query: (params) => {
        let url = '/all';
        if (params) {
          const query = new URLSearchParams(params).toString();
          url += `?${query}`;
        }
        return url;
      },
      providesTags: (result) => 
        result?.orders 
          ? [...result.orders.map(({ _id }) => ({ type: 'SalesOrder', id: _id })), 'SalesOrder']
          : ['SalesOrder'],
    }),
    getSalesOrderById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'SalesOrder', id }],
    }),
    createSalesOrder: builder.mutation({
      query: (order) => ({
        url: '/create',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['SalesOrder', 'Product'], // Also invalidates products because stock changes
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/status/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SalesOrder', id }, 'SalesOrder', 'Product'],
    }),
    getCustomerOrders: builder.query({
      query: (customerId) => `/customer/${customerId}`,
      providesTags: ['SalesOrder'],
    }),
  }),
})

export const {
  useGetSalesOrdersQuery,
  useGetSalesOrderByIdQuery,
  useCreateSalesOrderMutation,
  useUpdateOrderStatusMutation,
  useGetCustomerOrdersQuery,
} = salesOrderApi
