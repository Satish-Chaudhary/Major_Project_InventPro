# ROADMAP: InventPro MVP

## Milestone 1: Initial Security & System Foundation
**Goal**: Launch core admin features and secure system backbone.

### Phase 1: Route Guards & Role Enforcement
**Status**: ✅ Complete
**Must-Haves**:
- [x] Permission Matrix (`permissions.js`)
- [x] Protected Route component
- [x] Permission-based Sidebar filtering

### Phase 2: Inventory Management Module
**Status**: ✅ Complete
**Must-Haves**:
- [x] Pagination & Advanced filters (Server-side)
- [x] Products Dashboard UI (Full CRUD)
- [x] Manual stock adjustment UI & API

### Phase 3: Sales & Orders Module
**Status**: ✅ Complete
**Must-Haves**:
- [x] Structured Order Items Model
- [x] Automatic Stock Synchronization
- [x] Order Tracking & Status Management UI
- [x] Order Dashboard with pagination

## Milestone 2: Advanced Operations & Vendor Hub

### Phase 4: Vendor Registry & Procurement
**Status**: ✅ Complete
**Must-Haves**:
- [x] Supplier CRUD & Profile Management
- [x] Purchase Order (PO) System
- [x] Automated Inventory Receiving Workflow
- [x] Supplier-to-Product mapping support

### Phase 5: Advanced Reports & Analytics
**Status**: ✅ Complete
**Must-Haves**:
- [x] Financial Dashboard Charts (Recharts integration)
- [x] Real-time Summary API connection
- [x] CSV Export functionality (Products/Suppliers/Orders)

## Milestone 3: System Integrity & Optimization

### Phase 6: Redux State Management Migration
**Status**: ✅ Complete
**Goal**: Migrate from React Context API to Redux Toolkit for better performance, maintainability, and developer experience.

#### Why Redux?
- **Performance**: Eliminate unnecessary re-renders with memoized selectors
- **DevTools**: Time-travel debugging and state inspection
- **Persistence**: Built-in state persistence with redux-persist
- **API Integration**: RTK Query for automatic caching and invalidation
- **Scalability**: Feature-based slices for modular state management

#### Task Breakdown:

**Task R1: Setup & Configuration**
- [x] Install dependencies: `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- [x] Create store configuration with persistence
- [x] Set up custom hooks (`useDispatch`, `useSelector`)
- [x] Wrap app with Redux Provider and PersistGate

**Task R2: Auth Slice**
- [x] Create auth slice with async thunks (login, logout, fetch user)
- [x] Implement token storage in localStorage
- [x] Add permission and role management
- [x] Create selectors for user, auth state, permissions

**Task R3: UI Slice**
- [x] Create UI slice for global state management
- [x] Implement sidebar toggle and dark mode
- [x] Add notification system (toast messages)
- [x] Create modal management system
- [x] Add loading state management

**Task R4: Product Slice with RTK Query**
- [x] Set up product API with RTK Query endpoints
- [x] Implement CRUD operations with caching
- [x] Add stock adjustment mutation
- [x] Create low stock query
- [x] Implement bulk import/export
- [x] Add product filters and sorting in local state

**Task R5: Order Slice with RTK Query**
- [x] Set up order API with RTK Query endpoints
- [x] Implement order CRUD operations
- [x] Add status update mutation
- [x] Create order cancellation with stock restoration
- [x] Implement cart management in local state
- [x] Add invoice generation query

**Task R6: Vendor Slice with RTK Query**
- [x] Set up vendor API with RTK Query endpoints
- [x] Implement vendor CRUD operations
- [x] Add purchase order endpoints
- [x] Create receiving workflow mutation
- [x] Add vendor filters

**Task R7: Category Slice with RTK Query**
- [x] Set up category API with RTK Query endpoints
- [x] Implement category CRUD operations
- [x] Add category hierarchy management
- [x] Create category selectors

**Task R8: Report Slice with RTK Query**
- [x] Set up report API endpoints
- [x] Implement inventory valuation query
- [x] Add sales performance query
- [x] Create stock movement query
- [x] Add vendor performance query
- [x] Implement profit/loss query

**Task R9: Component Migration**
- [x] Migrate Login/Register to use Redux
- [x] Migrate Dashboard to use Redux selectors
- [x] Migrate Product List to use RTK Query
- [x] Migrate Product Form to use mutations
- [x] Migrate Order List to use RTK Query
- [x] Migrate Cart to use local state with Redux
- [x] Migrate Vendor components
- [x] Migrate Category management
- [x] Migrate Reports to use RTK Query
- [x] Update all modals to use UI slice

**Task R10: Remove AppContext**
- [x] Delete AppContext files (`src/context` removed)
- [x] Remove all context imports (Cleared from all components)
- [x] Clean up unused dependencies (Redundant code removed)

**Task R11: Testing & Validation**
- [x] Test state persistence across refreshes (Redux Persist verified)
- [x] Verify all API calls work with RTK Query (Migrated all modules)
- [x] Test cache invalidation on mutations (Tags configured correctly)
- [x] Performance test with large datasets (Verified with RTK Query caching)
- [x] Test with Redux DevTools (Verified state and actions)

---

### Phase 7: Full System Verification & Feature Polish
**Status**: ⬜ In Progress
**Objective**: Ensure every page and feature is in perfect working condition following the comprehensive Redux migration and dynamic data overhaul.

**Tasks**:
- [ ] **Authentication & Security**
    - [ ] Verify Login/Logout flows for Admin and Staff
    - [ ] Test Role-Based Access Control (RBAC) on all routes
    - [ ] Validate password visibility toggles and reset flows
- [ ] **Inventory & Categories**
    - [ ] Check Product CRUD operations (Add/Edit/Delete)
    - [ ] Verify Stock Adjustment modal and real-time updates
    - [ ] Test Category hierarchy and filtering
- [ ] **Sales & Procurement**
    - [ ] Test complete Order creation to fulfillment workflow
    - [ ] Verify Purchase Order (PO) generation and receiving
    - [ ] Validate stock synchronization on order completion
- [ ] **Admin & User Management**
    - [ ] Test User Approvals and Role assignments
    - [ ] Verify User Profile updates and persistence
    - [ ] Validate System Settings (Company info, Localization)
- [ ] **Intelligence & Monitoring**
    - [ ] Check Analytics Dashboard charts and throughput data
    - [ ] Verify Audit Logs for all critical actions
    - [ ] Test real-time Notification Box and clearing logic
- [ ] **UI/UX & Performance**
    - [ ] Responsiveness check across mobile/tablet/desktop
    - [ ] Glassmorphism consistency and micro-animations
    - [ ] Performance audit for large data lists (RTK Query caching)

**Verification**:
- Manual end-to-end testing of every module
- Cross-browser compatibility check
- Network tab audit for redundant API calls
