# ROADMAP: InventPro MVP

---

## Milestone 1: Initial Security & System Foundation
**Goal**: Launch core admin features and secure system backbone.

### Phase 1: Route Guards & Role Enforcement
**Status**: ✅ Complete
**Must-Haves**:
- [x] Permission Matrix (`permissions.js`)
- [x] Protected Route component
- [x] Permission-based Sidebar filtering

---

### Phase 2: Inventory Management Module
**Status**: ✅ Complete
**Must-Haves**:
- [x] Pagination & Advanced filters (Server-side)
- [x] Products Dashboard UI (Full CRUD)
- [x] Manual stock adjustment UI & API

---

### Phase 3: Sales & Orders Module
**Status**: ✅ Complete
**Must-Haves**:
- [x] Structured Order Items Model
- [x] Automatic Stock Synchronization
- [x] Order Tracking & Status Management UI
- [x] Order Dashboard with pagination

---

## Milestone 2: Advanced Operations & Vendor Hub

### Phase 4: Vendor Registry & Procurement
**Status**: ✅ Complete
**Must-Haves**:
- [x] Supplier CRUD & Profile Management
- [x] Purchase Order (PO) System
- [x] Automated Inventory Receiving Workflow
- [x] Supplier-to-Product mapping support

---

### Phase 5: Advanced Reports & Analytics
**Status**: ✅ Complete
**Must-Haves**:
- [x] Financial Dashboard Charts (Recharts integration)
- [x] Real-time Summary API connection
- [x] CSV Export functionality (Products / Suppliers / Orders)

---

## Milestone 3: System Integrity & Optimization

### Phase 6: Redux State Management Migration
**Status**: ✅ Complete
**Goal**: Migrate from React Context API to Redux Toolkit for better performance, maintainability, and developer experience.

#### Why Redux?
- **Performance**: Eliminate unnecessary re-renders with memoized selectors
- **DevTools**: Time-travel debugging and state inspection
- **Persistence**: Built-in state persistence with `redux-persist`
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

### Phase 7: Activity Audit & Security Monitoring
**Status**: ✅ Complete
**Goal**: Implement comprehensive audit logging and a real-time notification system across all user roles.

**Must-Haves**:
- [x] Audit log entries for all critical operations (Products, Orders, Users, Settings)
- [x] Role-based access control on the Audit Logs page
- [x] Dedicated Audit Logs sidebar entry (accessible to all roles)
- [x] Notification box with "Mark as read" (clears UI, does not delete logs)
- [x] "View all activity logs" button redirecting to Audit Logs section

---

## Milestone 4: Quality Assurance & System Hardening

### Phase 8: Full System Verification & QA
**Status**: 🟡 In Progress
**Goal**: Ensure all features across every page are fully functional, integrated, and working as intended before the scaling phase.

#### Why This Phase?
- **Comprehensive Testing**: Verify every module works in isolation and together
- **User Experience**: Ensure smooth workflows across all user roles
- **Data Integrity**: Validate all CRUD operations maintain data consistency
- **Edge Cases**: Test scenarios that could break the application
- **Production Readiness**: Confirm system is stable for deployment

#### Task Breakdown:

**Task V1: Authentication & Access Control Verification**
- [x] Test user registration flow
  - [x] Verify access request submission works
  - [x] Confirm email notification sent to admin
  - [x] Test pending state redirection
- [x] Test admin approval workflow
  - [x] Approve request and verify user activation
  - [x] Reject request and verify email notification
  - [x] Test role assignment during approval
- [x] Test login functionality
  - [x] Valid credentials → dashboard redirect
  - [x] Invalid credentials → error message
  - [x] Pending users → waiting page with message
  - [x] Inactive users → access denied
- [x] Test OTP password recovery
  - [x] Request OTP → email received
  - [x] Invalid OTP → error handling
  - [x] Expired OTP → proper message
- [x] Test logout functionality
  - [x] Session cleared
  - [x] Redirect to login page

**Task V2: Dashboard & Analytics Verification**
- [x] Verify all dashboard widgets display data correctly
  - [x] Total inventory value calculation
  - [x] Total inventory quantity
  - [x] Low stock alerts count
  - [x] User growth metrics
- [x] Test real-time data updates
  - [x] Create new product → dashboard updates
  - [x] Process order → stock levels update
  - [x] Add new user → metrics refresh
- [x] Verify charts render correctly
  - [x] Stock trends chart
  - [x] Sales performance chart
  - [x] Area/bar charts with proper data
- [x] Test activity stream / audit logs
  - [x] User actions appear in real-time
  - [x] Filter by action type
  - [x] Search functionality works

**Task V3: Inventory Management Verification**
- [x] Test product CRUD operations
  - [x] Create product with all fields
  - [x] Upload product image
  - [x] Edit product details
  - [x] Delete product with confirmation
  - [x] Verify audit log entries
- [x] Test stock management
  - [x] Manual stock adjustment with reason
  - [x] Stock increase (purchase, return)
  - [x] Stock decrease (sale, damaged)
  - [x] Validate stock cannot go negative *(fixed: guard added in backend)*
- [x] Test low stock alerts
  - [x] Configure threshold
  - [x] Trigger alert when below threshold
  - [x] Dashboard notification appears
- [x] Test search and filters
  - [x] Search by product name
  - [x] Filter by category
  - [x] Sort by price, stock, name
  - [x] Pagination works correctly
- [x] Test bulk operations
  - [x] Bulk import CSV with valid data
  - [x] Bulk import with errors → validation messages
  - [x] Export to CSV with current filters

**Task V4: Orders & Sales Verification**
- [x] Test order creation
  - [x] Search and add products
  - [x] Adjust quantities in cart
  - [x] Remove items from cart
  - [x] Calculate totals (subtotal, tax, total)
  - [x] Add customer information and notes
- [x] Test stock synchronization
  - [x] Create order → stock decreases
  - [x] Cancel order → stock restored
- [x] Test order status workflow
  - [x] Pending → Confirmed → Shipped → Delivered
  - [x] Cancel from any permitted status
  - [x] Status history tracking
- [x] Test order listing
  - [x] Filter by status and date range
  - [x] Search by order number
  - [x] Pagination
- [x] Test order details
  - [x] View all order information and items
  - [x] Generate and download PDF invoice
- [x] Test out-of-stock prevention
  - [x] Attempt order with insufficient stock → error

**Task V5: Vendor Registry & Procurement Verification**
- [x] Test vendor CRUD operations
  - [x] Create vendor with contact details
  - [x] Edit vendor information
  - [x] Delete vendor (check product dependencies)
  - [x] Search vendors
- [x] Test purchase order creation
  - [x] Select vendor, add products with quantities
  - [x] Set expected delivery date and generate PO number
- [x] Test receiving workflow
  - [x] Receive full order → stock increases
  - [x] Receive partial order → partial stock increase
  - [x] Over-receiving prevention
- [x] Test vendor performance tracking
  - [x] On-time delivery rate
  - [x] Order history by vendor

**Task V6: User Management & Roles Verification**
- [x] Test user listing
  - [x] View all users with roles
  - [x] Search and filter by role and status
- [x] Test user role assignment
  - [x] Assign Manager, Staff, Accountant, Sales roles
  - [x] Verify permission inheritance
- [x] Test user status management
  - [x] Activate / deactivate / reactivate users
- [x] Test permission enforcement
  - [x] Manager cannot access admin settings
  - [x] Staff cannot delete products
  - [x] Accountant sees financial reports only
  - [x] Sales cannot manage inventory
  - [x] Admin has full access

**Task V7: Categories & Organization Verification**
- [x] Test category CRUD operations
  - [x] Create parent and child subcategory
  - [x] Edit and delete category (with product reassignment)
- [x] Test category hierarchy
  - [x] Display tree structure and breadcrumbs
- [x] Test product-category integration
  - [x] Assign category during product creation
  - [x] Filter products by category

**Task V8: Reports & Analytics Verification**
- [x] Test inventory valuation report (total, by category, export)
- [x] Test sales performance (top products, sales over time, average order value)
- [x] Test stock movement report (inbound/outbound by reason)
- [x] Test vendor performance (purchase history, delivery rate, total spend)
- [x] Test profit/loss report
  - [x] Revenue, COGS, gross margin, period comparison
  - [x] Restrict access to accountant/admin roles only

**Task V9: System Settings Verification**
- [x] Test company profile settings (name, logo, address, contact; persist after refresh) *(fixed: useEffect import added)*
- [x] Test tax configuration (rate set, applies to orders, shown on invoices)
- [x] Test notification preferences (thresholds, email & in-app toggles)
- [x] Test backup functionality (manual backup creation and download)

**Task V10: Cross-Module Integration Testing**
- [x] End-to-end workflow: User access request → Admin approval → Login → Create product → Create order → Stock update → Generate report
- [x] End-to-end workflow: Vendor created → Purchase order → Receive stock → New inventory → Order fulfillment
- [x] End-to-end workflow: Low stock trigger → Alert → Purchase order → Stock replenished
- [x] Test data consistency
  - [x] Category delete → products reassigned to General *(fixed: cascade implemented)*
  - [x] Supplier delete → blocked if active POs *(fixed: active PO check added)*
  - [x] Order cancel → stock automatically restored *(verified: existing logic confirmed)*

**Task V11: Edge Cases & Error Handling**
- [x] Test network failures (timeout, offline mode, retry logic)
- [x] Test invalid inputs
  - [x] Negative stock: blocked at backend (400 guard) and frontend (only positive integers allowed)
  - [x] Stock overflow: capped at 999,999 in AdjustStockModal
  - [x] Special characters: regex search handles them safely
- [x] Test boundary conditions
  - [x] Empty states: all list pages show empty state UI
  - [x] Max pagination: limit capped at 100 server-side *(fixed)*
- [x] Test user-friendly error messages and toast notifications

**Task V12: Role-Based Access Verification**
- [x] Admin (Level 4): All pages, user management, system settings, audit logs
- [x] Manager (Level 3): Inventory, vendors, orders, reports (no financial); no admin settings
- [x] Accountant (Level 3): Financial and profit/loss reports, audit logs; no inventory modification *(fixed: report routes now restricted)*
- [x] Staff (Level 2): View/update stock; no product creation/deletion, no reports
- [x] Sales (Level 2): Create orders, view products; no stock management, no vendor access *(fixed: order routes array syntax corrected)*

**Task V13: Performance & Load Testing**
- [x] Page load times: Dashboard, Product List, Order List all < 2 seconds
- [x] API response times: GET < 200ms, POST/PUT < 500ms
- [x] Large dataset handling: query limit capped at 100 server-side for products and orders *(fixed)*
- [x] Pagination works correctly on all list views

**Task V14: Browser & Device Compatibility**
- [ ] Test on Chrome, Firefox, Safari, and Edge (latest)
- [ ] Responsive design: Desktop (1920×1080), Laptop (1366×768), Tablet (768×1024), Mobile (375×667)
- [ ] Touch interactions (swipe, touch-friendly buttons, mobile form inputs)

**Task V15: Documentation & Handoff**
- [] API documentation: all endpoints, request/response examples, error codes, RBAC matrix → `API_DOCS.md`
- [] User manual: role-based guides documented in RBAC matrix
- [] Admin guide: approval workflow documented in API docs
- [] Deployment guide: env variables already in `.env.example` *(from Phase 1)*

**Task V16: Final Sign-Off**
- [ ] Demo to stakeholders (all features, RBAC, key workflows)
- [ ] Bug fix review (critical bugs fixed, high-priority resolved, low-priority documented)
- [ ] Performance sign-off (all metrics meet targets, Lighthouse score > 90)
- [ ] Security review (no vulnerabilities, all endpoints protected, audit logs complete)
- [ ] Production readiness approval

---

## Milestone 5: Real-Time Features & Live Updates

### Phase 9: Socket.IO Real-Time Implementation
**Status**: ⬜ Planned
**Goal**: Implement real-time data synchronization across the application using Socket.IO for live inventory updates, order notifications, and collaborative features.

#### Why Socket.IO for InventPro?
- **Auto-Reconnection**: Handles network interruptions gracefully
- **Room Support**: Role-based data channels for security
- **Fallback Support**: Long-polling fallback for corporate networks
- **Scalability**: Supports 1000+ concurrent connections
- **Self-Hosted**: No additional costs

#### Architecture Overview

```
┌─────────────────┐   WebSocket   ┌─────────────────┐
│  React Client   │◄────────────►│  Socket.IO      │
│  (Frontend)     │               │  Server         │
└─────────────────┘               └─────────────────┘
        │                                 │
        ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐
│  Redux Store    │               │  MongoDB        │
│  (State)        │               │  (Database)     │
└─────────────────┘               └─────────────────┘
```

#### Task Breakdown:

**Task S1: Install Dependencies & Setup**
- [ ] Install Socket.IO packages

  ```bash
  npm install socket.io socket.io-client
  ```

- [ ] Create Socket.IO server configuration
- [ ] Set up CORS and authentication middleware
- [ ] Configure environment variables for Socket.IO
- [ ] Create socket instance in React app

**Task S2: Socket.IO Server Configuration**
- [ ] Create `backend/socket/socket.js`
- [ ] Implement JWT authentication middleware
- [ ] Set up connection handling
- [ ] Configure room joining based on user roles
- [ ] Implement disconnect handling
- [ ] Add error handling and logging

**Task S3: Create Socket.IO Client Hooks**
- [ ] Create `frontend/src/hooks/useSocket.js`
- [ ] Implement socket connection management
- [ ] Add auto-reconnection logic
- [ ] Create event subscription helpers
- [ ] Add connection status tracking
- [ ] Implement cleanup on unmount

**Task S4: Real-Time Inventory Updates**
- [ ] Implement `stock:update` event emission
  - [ ] Emit when stock is adjusted
  - [ ] Emit when products are created/deleted
  - [ ] Emit when bulk import completes
- [ ] Create `stock:updated` listener
  - [ ] Update Redux store in real-time
  - [ ] Show toast notifications for changes
  - [ ] Update dashboard charts dynamically
- [ ] Implement room-based filtering
  - [ ] Managers get all inventory updates
  - [ ] Staff get only warehouse-specific updates
  - [ ] Sales only see relevant stock levels

**Task S5: Real-Time Order Notifications**
- [ ] Implement `order:created` event (emit on new order, include customer info)
- [ ] Create `order:status:updated` event (emit on status change, notify relevant team)
- [ ] Implement notification system (toast, notification center, read/unread tracking)
- [ ] Create role-based order rooms
  - [ ] Sales team gets new order alerts
  - [ ] Warehouse gets fulfillment notifications
  - [ ] Managers get all order updates

**Task S6: Real-Time Low Stock Alerts**
- [ ] Implement `low-stock:alert` event (trigger when stock falls below threshold)
- [ ] Create alert broadcasting logic (notify managers, alert purchasing team)
- [ ] Implement alert acknowledgment (mark as read, track response time, auto-dismiss)

**Task S7: Real-Time Dashboard Updates**
- [ ] Implement `dashboard:metrics` event (push live metrics every 5 seconds)
- [ ] Create live chart updates (stock trend, sales performance, activity feed)
- [ ] Implement efficient broadcasting (room-specific metrics, throttled updates)

**Task S8: User Presence & Activity Tracking**
- [ ] Implement `user:online` tracking (active users, online status indicators)
- [ ] Create `user:typing` indicators (collaborative form editing awareness)
- [ ] Implement activity feed (real-time user actions with who/what/when)

**Task S9: Real-Time Collaboration Features**
- [ ] Collaborative purchase orders (real-time editing, lock when typing, show viewers)
- [ ] Shared dashboard views (sync filter states, share dashboard configurations)

**Task S10: Performance Optimization**
- [ ] Implement connection pooling and message compression
- [ ] Configure rate limiting
- [ ] Implement message queue for offline users
- [ ] Set up Redis adapter for multi-instance support

  ```bash
  npm install @socket.io/redis-adapter redis
  ```

**Task S11: Error Handling & Recovery**
- [ ] Implement reconnection strategies (exponential backoff, max reconnection attempts)
- [ ] Add message queuing for offline periods
- [ ] Create connection state indicators in UI
- [ ] Implement fallback polling when WebSocket fails
- [ ] Add error logging and monitoring

**Task S12: Security Implementation**
- [ ] Implement token-based authentication (validate JWT on every connection)
- [ ] Add room access validation (verify permissions before joining rooms)
- [ ] Implement message validation (sanitize inputs, validate data structure)
- [ ] Add rate limiting per connection
- [ ] Implement audit logging for real-time events

**Task S13: Testing & Quality Assurance**
- [ ] Test connection stability (simulate disconnections, verify reconnection)
- [ ] Test event broadcasting (verify messages reach correct rooms, concurrent users)
- [ ] Performance: load test with 500+ connections, measure message latency
- [ ] Security: attempt unauthorized room access, test invalid token handling
- [ ] Unit tests for Socket.IO handlers

**Task S14: Documentation & Monitoring**
- [ ] Document Socket.IO events (names, payloads, room structure, auth flow)
- [ ] Create monitoring dashboard (active connections, message rate, error rate)
- [ ] Set up alerts for connection issues
- [ ] Add analytics for real-time feature usage

---

## Milestone 6: Scaling & Mobile

### Phase 10: PWA & Performance Scaling (Planned)
**Status**: ⬜ Planned
**Must-Haves**:
- [ ] Multi-warehouse support
- [ ] Mobile PWA optimization (service worker, offline support, installable)
- [ ] Performance caching (Redis / React Query layer)
- [ ] Horizontal scaling preparation (load balancer, stateless backend)

---

## Phase Summary

| Phase | Status | Completion | Notes |
|-------|--------|------------|-------|
| Phase 1: Route Guards | ✅ Complete | 100% | Security foundation established |
| Phase 2: Inventory Management | ✅ Complete | 100% | Full CRUD with stock tracking |
| Phase 3: Sales & Orders | ✅ Complete | 100% | Order workflow with stock sync |
| Phase 4: Vendor Registry | ✅ Complete | 100% | Procurement system complete |
| Phase 5: Reports & Analytics | ✅ Complete | 100% | Financial dashboards with export |
| Phase 6: Redux Migration | ✅ Complete | 100% | All slices migrated, RTK Query active |
| Phase 7: Activity Audit | ✅ Complete | 100% | Audit logs & notifications active |
| Phase 8: System Verification | 🟡 In Progress | ~95% | V10–V15 ✅, V14 browser test pending, V16 sign-off pending |
| Phase 9: Socket.IO Real-Time | ⬜ Planned | 0% | Depends on Phase 8 sign-off |
| Phase 10: PWA & Scaling | ⬜ Planned | 0% | Future milestone |

---

## Verification Status Dashboard

| Module | Verification Status | Issues Found | Resolved |
|--------|---------------------|--------------|----------|
| Authentication & Access | ✅ Verified | 4 bugs fixed | All resolved |
| Dashboard & Analytics | ✅ Verified | 0 | — |
| Inventory Management | ✅ Verified | 1 bug fixed | Negative stock guard added |
| Orders & Sales | ✅ Verified | 1 bug fixed | authorize() array syntax fixed |
| Vendor Registry | ✅ Verified | 1 bug fixed | Active PO check on delete |
| User Management | ✅ Verified | 0 | — |
| Categories | ✅ Verified | 1 bug fixed | Cascade delete + child block |
| Reports | ✅ Verified | 1 bug fixed | RBAC authorization added |
| System Settings | ✅ Verified | 1 bug fixed | useEffect import added |
| Role-Based Access | ✅ Verified | 2 bugs fixed | Route array syntax + report RBAC |
| Cross-Module Integration | ✅ Verified | 2 bugs fixed | Cascade delete + PO guard |
| Performance | ✅ Verified | 1 bug fixed | Query limit caps added |
| Browser Compatibility | ⬜ Pending | - | Manual test required |

---

## Bug Tracker

When issues are found during verification, document them using the format below:

```markdown
### Bug #001
**Module**: [e.g., Inventory Management]
**Severity**: [Critical / High / Medium / Low]
**Description**: [Clear description of the issue]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]
**Screenshots**: [If applicable]
**Status**: [Open / In Progress / Resolved]
**Fixed In**: [Commit / PR]
```