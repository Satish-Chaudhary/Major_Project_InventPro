import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { serverUrl } from '../../config/api.js'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: serverUrl + '/api/admin',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'Role', 'Department', 'AuditLog', 'SecuritySummary'],
  endpoints: (builder) => ({
    // Users
    getUsers: builder.query({
      query: (params) => ({
        url: '/users/all',
        params,
      }),
      providesTags: (result) =>
        result?.users
          ? [
            ...result.users.map(({ _id }) => ({ type: 'User', id: _id })),
            { type: 'User', id: 'LIST' },
          ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    addUser: builder.mutation({
      query: (userData) => ({
        url: '/users/add',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'AuditLog'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/update/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'AuditLog'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'AuditLog'],
    }),

    // Roles
    getRoles: builder.query({
      query: () => '/roles/all',
      providesTags: (result) =>
        result?.roles
          ? [
            ...result.roles.map(({ _id }) => ({ type: 'Role', id: _id })),
            { type: 'Role', id: 'LIST' },
          ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    addRole: builder.mutation({
      query: (roleData) => ({
        url: '/roles/add',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }, 'AuditLog'],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/roles/update/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, 'AuditLog'],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }, 'AuditLog'],
    }),

    // Departments
    getDepartments: builder.query({
      query: () => '/departments/all',
      providesTags: ['Department'],
    }),
    addDepartment: builder.mutation({
      query: (deptData) => ({
        url: '/departments/add',
        method: 'POST',
        body: deptData,
      }),
      invalidatesTags: ['Department', 'AuditLog'],
    }),

    // Audit Logs
    getAuditLogs: builder.query({
      query: (params) => ({
        url: '/audit-logs/all',
        params,
      }),
      providesTags: ['AuditLog'],
    }),

    // Security Summary (from /api/auth/security-summary in AppContext)
    // Wait, AppContext has it at /api/auth/security-summary. 
    // I'll move it to adminApi or keep it in authSlice?
    // Since it's a query for summary, let's put it in adminApi for logical separation.
    getSecuritySummary: builder.query({
      query: () => ({
        url: '../auth/security-summary', // escape /api/admin
      }),
      providesTags: ['SecuritySummary'],
    }),

    // User Approvals (from /api/auth in AppContext)
    getPendingRequests: builder.query({
      query: () => ({
        url: '../auth/pending-requests',
      }),
      providesTags: ['User'],
    }),
    approveUser: builder.mutation({
      query: (id) => ({
        url: `../auth/approve/${id}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'AuditLog'],
    }),
    rejectUser: builder.mutation({
      query: ({ id, reason }) => ({
        url: `../auth/reject/${id}`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }, 'AuditLog'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useGetAuditLogsQuery,
  useGetSecuritySummaryQuery,
  useGetPendingRequestsQuery,
  useApproveUserMutation,
  useRejectUserMutation,
} = adminApi
