import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const reportApi = createApi({
  reducerPath: 'reportApi',
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
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getSummaryReport: builder.query({
      query: () => '/reports/summary',
    }),
    getReports: builder.query({
      query: () => '/reports/all',
      providesTags: ['Report'],
    }),
    createReportSchedule: builder.mutation({
      query: (schedule) => ({
        url: '/reports/add',
        method: 'POST',
        body: schedule,
      }),
      invalidatesTags: ['Report'],
    }),
    logDownload: builder.mutation({
      query: (downloadData) => ({
        url: '/reports/log-download',
        method: 'POST',
        body: downloadData,
      }),
    }),
    // Planned endpoints based on roadmap
    getInventoryValuation: builder.query({
      query: () => '/reports/inventory-valuation',
    }),
    getSalesPerformance: builder.query({
      query: (params) => ({
        url: '/reports/sales-performance',
        params,
      }),
    }),
    getStockMovement: builder.query({
      query: (params) => ({
        url: '/reports/stock-movement',
        params,
      }),
    }),
    getVendorPerformance: builder.query({
      query: () => '/reports/vendor-performance',
    }),
  }),
})

export const {
  useGetSummaryReportQuery,
  useGetReportsQuery,
  useCreateReportScheduleMutation,
  useLogDownloadMutation,
  useGetInventoryValuationQuery,
  useGetSalesPerformanceQuery,
  useGetStockMovementQuery,
  useGetVendorPerformanceQuery,
} = reportApi
