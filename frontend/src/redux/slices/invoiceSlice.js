import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: serverUrl + '/api/invoices',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: () => '/all',
      providesTags: (result) => 
        result?.invoices 
          ? [...result.invoices.map(({ _id }) => ({ type: 'Invoice', id: _id })), 'Invoice']
          : ['Invoice'],
    }),
    getInvoiceById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    generateInvoice: builder.mutation({
      query: (orderId) => ({
        url: `/generate/${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoiceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useGenerateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
} = invoiceApi
