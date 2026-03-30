import { createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products/all',
        params,
      }),
      providesTags: (result) =>
        result?.products
          ? [
            ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
            { type: 'Product', id: 'LIST' },
          ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products/add',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: `/products/update/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    deleteMultipleProducts: builder.mutation({
      query: (ids) => ({
        url: '/products/delete-multiple',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateStock: builder.mutation({
      query: ({ id, quantity, reason, notes }) => ({
        url: `/products/${id}/stock`, // Need to verify if this exists in backend
        method: 'PATCH',
        body: { quantity, reason, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
    getLowStock: builder.query({
      query: () => '/products/low-stock',
      providesTags: [{ type: 'Product', id: 'LOW_STOCK' }],
    }),
    bulkImport: builder.mutation({
      query: (formData) => ({
        url: '/products/bulk-import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    exportProducts: builder.query({
      query: (params) => ({
        url: '/products/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
})

// Local state slice for product UI
const productSlice = createSlice({
  name: 'products',
  initialState: {
    filters: {
      search: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc',
    },
    selectedProduct: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        sortBy: 'name',
        sortOrder: 'asc',
      }
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
  },
})

export const { setFilters, resetFilters, setSelectedProduct } =
  productSlice.actions

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteMultipleProductsMutation,
  useUpdateStockMutation,
  useGetLowStockQuery,
  useBulkImportMutation,
  useExportProductsQuery,
} = productApi

export default productSlice.reducer

// Selectors
export const selectProductFilters = (state) => state.products.filters
export const selectSelectedProduct = (state) => state.products.selectedProduct
