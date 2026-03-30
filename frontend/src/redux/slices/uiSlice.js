import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  notifications: [],
  lastReadAuditTime: parseInt(localStorage.getItem('lastReadAuditTime')) || 0,
  searchQuery: '',
  activeTab: 'dashboard',
  modals: {
    productForm: { isOpen: false, mode: 'create', productId: null },
    vendorForm: { isOpen: false, mode: 'create', vendorId: null },
    stockAdjustment: { isOpen: false, productId: null },
    confirmation: { isOpen: false, message: '', onConfirm: null },
  },
  loading: {
    global: false,
    products: false,
    orders: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    clearAuditNotifications: (state) => {
      const now = Date.now()
      state.lastReadAuditTime = now
      localStorage.setItem('lastReadAuditTime', now)
    },
    openModal: (state, action) => {
      const { modalName, ...props } = action.payload
      state.modals[modalName] = {
        ...state.modals[modalName],
        isOpen: true,
        ...props,
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload
      state.modals[modalName] = {
        ...state.modals[modalName],
        isOpen: false,
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  addNotification,
  removeNotification,
  clearNotifications,
  clearAuditNotifications,
  openModal,
  closeModal,
  setSearchQuery,
  setActiveTab,
  setGlobalLoading,
  setLoading,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectDarkMode = (state) => state.ui.darkMode
export const selectNotifications = (state) => state.ui.notifications
export const selectLastReadAuditTime = (state) => state.ui.lastReadAuditTime
export const selectSearchQuery = (state) => state.ui.searchQuery
export const selectActiveTab = (state) => state.ui.activeTab
export const selectUnreadCount = (state) =>
  state.ui.notifications.filter((n) => !n.read).length
export const selectModal = (modalName) => (state) => state.ui.modals[modalName]
export const selectGlobalLoading = (state) => state.ui.loading.global
