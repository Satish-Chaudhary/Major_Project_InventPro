import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const activityApi = createApi({
  reducerPath: 'activityApi',
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
  tagTypes: ['Activity'],
  endpoints: (builder) => ({
    getActivities: builder.query({
      query: (params) => ({
        url: '/activities/all',
        params,
      }),
      providesTags: ['Activity'],
    }),
    getSystemActivities: builder.query({
      query: () => '/activities/system',
      providesTags: ['Activity'],
    }),
  }),
})

export const {
  useGetActivitiesQuery,
  useGetSystemActivitiesQuery
} = activityApi
