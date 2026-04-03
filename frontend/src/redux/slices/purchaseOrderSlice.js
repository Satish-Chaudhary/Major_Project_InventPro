import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const purchaseOrderApi = createApi({
  reducerPath: 'purchaseOrderApi',
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
  tagTypes: ['PurchaseOrder'],
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query({
      query: (params) => ({
        url: '/purchase-orders/all',
        params,
      }),
      providesTags: (result) =>
        result?.orders
          ? [
            ...result.orders.map(({ _id }) => ({ type: 'PurchaseOrder', id: _id })),
            { type: 'PurchaseOrder', id: 'LIST' },
          ]
          : [{ type: 'PurchaseOrder', id: 'LIST' }],
    }),
    getPurchaseOrderById: builder.query({
      query: (id) => `/purchase-orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'PurchaseOrder', id }],
    }),
    createPurchaseOrder: builder.mutation({
      query: (po) => ({
        url: '/purchase-orders/add',
        method: 'POST',
        body: po,
      }),
      invalidatesTags: [{ type: 'PurchaseOrder', id: 'LIST' }],
    }),
    updatePurchaseOrder: builder.mutation({
      query: ({ id, ...po }) => ({
        url: `/purchase-orders/update/${id}`,
        method: 'PUT',
        body: po,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PurchaseOrder', id }, { type: 'PurchaseOrder', id: 'LIST' }],
    }),
    deletePurchaseOrder: builder.mutation({
      query: (id) => ({
        url: `/purchase-orders/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'PurchaseOrder', id: 'LIST' }],
    }),
    receivePurchaseOrder: builder.mutation({
      query: ({ id, items }) => ({
        url: `/purchase-orders/receive/${id}`,
        method: 'POST',
        body: { items },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PurchaseOrder', id }, { type: 'PurchaseOrder', id: 'LIST' }],
    }),
    updatePOStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/purchase-orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PurchaseOrder', id }, { type: 'PurchaseOrder', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderByIdQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  useReceivePurchaseOrderMutation,
  useUpdatePOStatusMutation,
} = purchaseOrderApi