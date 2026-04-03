Here's a comprehensive `prompt.md` file that translates the PRD into actionable implementation tasks based on the current state and next steps identified in your report:

```markdown
# InventPro - Implementation Prompt

## Context
You are implementing **InventPro MVP**, a real-time inventory management system with enterprise-grade RBAC. The core administrative and security modules are already deployed. Your task is to complete the remaining feature modules while maintaining security standards, role-based access control, and the established dark luxury aesthetic.

## Current System State

### ✅ Already Implemented
- **Authentication System**: JWT-based auth with OTP recovery
- **Access Request Workflow**: User registration → Admin approval → Role assignment
- **Admin Control Center**: Dashboard with system metrics, activity streams
- **RBAC Framework**: Four-tier hierarchy (Administrator, Manager, Accountant, Staff/Sales)
- **Audit Logging**: High-fidelity activity tracking
- **Email Notifications**: Dual notification system for user/admin
- **Database Models**: AccessRequests, Roles, ActivityLogs

### 🚧 Pending Implementation (By Priority)

## Implementation Tasks

### Phase 1: Route Guards & Role Enforcement (Critical Path)

**Task 1.1**: Implement Permission-Based Route Guards
- [ ] Create `usePermission` hook to check user capabilities
- [ ] Implement route protection wrapper `<ProtectedRoute>` with role validation
- [ ] Add sidebar menu filtering based on user role
- [ ] Test all routes against permission matrix

**Acceptance Criteria**:
- Manager cannot access Admin Settings page
- Staff cannot delete products
- Sales cannot modify inventory counts
- Redirect to unauthorized page with clear message

**Permission Matrix Reference**:
| Capability | Admin | Manager | Accountant | Staff | Sales |
|------------|-------|---------|------------|-------|-------|
| create_product | ✅ | ✅ | ❌ | ✅ | ❌ |
| delete_product | ✅ | ✅ | ❌ | ❌ | ❌ |
| update_stock | ✅ | ✅ | ❌ | ✅ | ❌ |
| create_order | ✅ | ✅ | ❌ | ❌ | ✅ |
| manage_users | ✅ | ❌ | ❌ | ❌ | ❌ |
| view_reports | ✅ | ✅ | ✅ | ❌ | ❌ |
| manage_vendors | ✅ | ✅ | ❌ | ❌ | ❌ |
| audit_logs | ✅ | ❌ | ✅ | ❌ | ❌ |

---

### Phase 2: Inventory Management Module

**Task 2.1**: Product CRUD Operations
- [ ] Create product listing page with search/filter
- [ ] Implement product creation form with validation
- [ ] Add product edit/delete functionality
- [ ] Display product images (upload to Cloudinary)
- [ ] Show stock quantity with low stock highlighting

**Task 2.2**: Stock Management
- [ ] Create stock adjustment interface (add/remove)
- [ ] Add stock movement reason tracking (purchase, sale, adjustment, damaged)
- [ ] Implement low stock threshold configuration
- [ ] Display low stock alerts on dashboard
- [ ] Add bulk stock import/export (CSV)

**Acceptance Criteria**:
- Stock updates reflect instantly across all users
- Low stock alerts trigger at configured threshold
- Stock movements logged in audit trail
- Warehouse Staff can only update stock, not delete products

**API Endpoints Required**:

GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/stock
GET    /api/products/low-stock
POST   /api/products/bulk-import


---

### Phase 3: Sales & Orders Module

**Task 3.1**: Order Management
- [ ] Create order creation interface with product search
- [ ] Implement shopping cart functionality
- [ ] Calculate order totals with tax
- [ ] Display order history with status tracking
- [ ] Add order status workflow (pending → confirmed → shipped → delivered)

**Task 3.2**: Inventory Integration
- [ ] Auto-deduct stock when order is confirmed
- [ ] Prevent ordering out-of-stock items
- [ ] Add order cancellation with stock restoration
- [ ] Generate order receipts/invoices

**Acceptance Criteria**:
- Order creation automatically reduces inventory
- Cannot order more than available stock
- Cancelled orders restore inventory counts
- Sales staff can only create orders, not manage products

**API Endpoints Required**:

GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
DELETE /api/orders/:id
GET    /api/orders/invoice/:id


---

### Phase 4: Vendor Registry Module

**Task 4.1**: Vendor Management
- [ ] Create vendor listing with contact details
- [ ] Add vendor creation/editing form
- [ ] Track vendor performance metrics
- [ ] Maintain vendor product catalog
- [ ] Add vendor rating system

**Task 4.2**: Purchase Orders
- [ ] Create purchase order interface
- [ ] Link products to vendors
- [ ] Implement receiving workflow
- [ ] Auto-update inventory on receiving

**Acceptance Criteria**:
- Purchase orders increase inventory when received
- Vendor contact information easily accessible
- Purchase history tracked per vendor

**API Endpoints Required**:

GET    /api/vendors
POST   /api/vendors
PUT    /api/vendors/:id
DELETE /api/vendors/:id
GET    /api/vendors/:id/products
POST   /api/purchase-orders
GET    /api/purchase-orders


---

### Phase 5: Advanced Reports & Analytics

**Task 5.1**: Report Generation
- [ ] Implement inventory valuation report
- [ ] Create sales performance dashboard
- [ ] Add stock movement reports
- [ ] Generate vendor performance reports
- [ ] Enable CSV/PDF export

**Task 5.2**: Advanced Analytics
- [ ] Create forecasting charts (Chart.js/Recharts)
- [ ] Add seasonal trend analysis
- [ ] Implement top/bottom product analysis
- [ ] Create profit/loss calculations

**Acceptance Criteria**:
- Reports generate in < 5 seconds
- Export functionality works for all reports
- Accountant can access all financial reports
- Staff cannot access cost/profit data

**API Endpoints Required**:

GET    /api/reports/inventory
GET    /api/reports/sales
GET    /api/reports/stock-movement
GET    /api/reports/vendor-performance
GET    /api/reports/profit-loss
GET    /api/analytics/dashboard


---

### Phase 6: Item Categories Module

**Task 6.1**: Category Management
- [ ] Create category hierarchy (parent/child)
- [ ] Add category CRUD operations
- [ ] Display products by category
- [ ] Implement category-based reporting

**Acceptance Criteria**:
- Products organized by categories
- Category changes reflect across inventory
- Sales reports filterable by category

---

### Phase 7: System Settings & Final Polish

**Task 7.1**: System Configuration
- [ ] Create company profile settings
- [ ] Add tax rate configuration
- [ ] Implement notification preferences
- [ ] Add backup/export data functionality

**Task 7.2**: Final Polish
- [ ] Implement loading skeletons
- [ ] Add error boundaries
- [ ] Optimize React queries with React Query
- [ ] Add keyboard shortcuts
- [ ] Implement dark mode toggle

---

## Technical Requirements

### Frontend Stack
- React 18+ with Vite
- Tailwind CSS + Framer Motion
- React Router v6
- TanStack Query (React Query)
- Recharts for analytics
- React Hook Form + Zod

### Backend Stack (Existing)
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer for emails

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint + Prettier configured
- Component storybook (optional)
- 80% test coverage minimum

## Testing Requirements

### Unit Tests
- [ ] All utility functions tested
- [ ] React components snapshot tested
- [ ] Permission logic tested

### Integration Tests
- [ ] API endpoint tests
- [ ] Authentication flow tests
- [ ] Order → Inventory sync tests

### E2E Tests
- [ ] Complete user journey: Request → Approval → Login → Create Order
- [ ] Role permission enforcement
- [ ] Stock update propagation

---

## Definition of Done

Each task is complete when:
- [ ] Code committed with meaningful messages
- [ ] Unit tests passing (80% coverage)
- [ ] Manual verification completed
- [ ] API documentation updated
- [ ] Role-based access verified
- [ ] Audit logs recording actions
- [ ] PR reviewed and merged

---

## Deliverables Summary

By completing these tasks, you will deliver:
1. A fully functional inventory management system with all 12 core modules
2. Enterprise-grade RBAC with granular permissions
3. Real-time stock tracking and order management
4. Comprehensive reporting and analytics
5. Vendor management and purchase order workflow
6. Full audit trail for compliance

---

## Getting Started

1. Review existing codebase structure
2. Verify database connection and models
3. Test existing auth flow
4. Begin with Phase 1: Route Guards
5. Validate permissions before adding features

**Reference Documents**:
- `inventory-system-specification.md` - Detailed technical specs
- Existing implementation report - Current state documentation
- API documentation - Endpoint contracts
```