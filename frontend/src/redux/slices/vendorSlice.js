import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const vendorApi = createApi({
  reducerPath: 'vendorApi',
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
  tagTypes: ['Vendor', 'PurchaseOrder'],
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: (params) => ({
        url: '/suppliers/all',
        params,
      }),
      providesTags: (result) =>
        result?.suppliers
          ? [
            ...result.suppliers.map(({ _id }) => ({ type: 'Vendor', id: _id })),
            { type: 'Vendor', id: 'LIST' },
          ]
          : [{ type: 'Vendor', id: 'LIST' }],
    }),
    getVendorById: builder.query({
      query: (id) => `/suppliers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vendor', id }],
    }),
    createVendor: builder.mutation({
      query: (vendor) => ({
        url: '/suppliers/add',
        method: 'POST',
        body: vendor,
      }),
      invalidatesTags: [{ type: 'Vendor', id: 'LIST' }],
    }),
    updateVendor: builder.mutation({
      query: ({ id, ...vendor }) => ({
        url: `/suppliers/update/${id}`,
        method: 'PUT',
        body: vendor,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vendor', id }, { type: 'Vendor', id: 'LIST' }],
    }),
    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `/suppliers/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Vendor', id: 'LIST' }],
    }),
    getPurchaseOrders: builder.query({
      query: (params) => ({
        url: '/purchase-orders/all',
        params,
      }),
      providesTags: (result) =>
        result?.purchaseOrders
          ? [
            ...result.purchaseOrders.map(({ _id }) => ({ type: 'PurchaseOrder', id: _id })),
            { type: 'PurchaseOrder', id: 'LIST' },
          ]
          : [{ type: 'PurchaseOrder', id: 'LIST' }],
    }),
    createPurchaseOrder: builder.mutation({
      query: (po) => ({
        url: '/purchase-orders/add',
        method: 'POST',
        body: po,
      }),
      invalidatesTags: [{ type: 'PurchaseOrder', id: 'LIST' }],
    }),
    receivePO: builder.mutation({
      query: ({ id, receivedItems }) => ({
        url: `/purchase-orders/receive/${id}`,
        method: 'PUT',
        body: { receivedItems },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PurchaseOrder', id }, { type: 'PurchaseOrder', id: 'LIST' }],
    }),
  }),
})

const vendorSlice = createSlice({
  name: 'vendors',
  initialState: {
    filters: {
      search: '',
    },
  },
  reducers: {
    setVendorFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
})

export const { setVendorFilters } = vendorSlice.actions

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useGetPurchaseOrdersQuery,
  useCreatePurchaseOrderMutation,
  useReceivePOMutation,
} = vendorApi

export default vendorSlice.reducer
