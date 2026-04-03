# InventPro - Detailed Technical Documentation

> Last Updated: April 3, 2026

---

## 1. Database Schema & Models

### 1.1 Core Entities Relationship

```
User (auth.model.js)
    ├── role: ['root', 'admin', 'manager', 'accountant', 'staff', 'warehouse staff', 'sales staff']
    ├── status: ['pending', 'active', 'inactive', 'rejected']
    └── References: Created sales orders, activity logs

Product (product.model.js)
    ├── category: ObjectId[] → Category
    ├── skuId: Unique identifier
    ├── barcodeEAN: Barcode value
    ├── initialQty: Current stock quantity
    ├── lowStockThreshold: Alert threshold (default: 10)
    ├── basePrice: Selling price
    ├── costPrice: Purchase cost
    ├── tax: Tax percentage
    └── status: ['in stock', 'low stock', 'out of stock']

Category (category.model.js)
    ├── catName: Unique category name
    ├── slug: URL-friendly identifier
    ├── parent: Self-referencing (hierarchical categories)
    └── thumbnail: Category image

Supplier (supplier.model.js)
    ├── company: Company name
    ├── code: Unique supplier code
    ├── contact, email, phone: Contact details
    ├── categories: ObjectId[] → Category (supplied categories)
    ├── reliability: Score 0-100
    └── status: ['Active', 'Inactive']

Customer (customer.model.js)
    ├── customerNumber: Auto-generated (CUST000001)
    ├── customerType: ['individual', 'business']
    ├── name, email (unique), phone (required)
    ├── companyName, taxId: Business fields
    ├── billingAddress, shippingAddress: Embedded objects
    ├── creditLimit, currentBalance: Financial tracking
    ├── totalSpent, totalOrders: Aggregated stats
    └── isActive: Boolean toggle

Order (order.model.js) - Legacy
    ├── orderId: Unique string
    ├── type: ['inward', 'outward']
    ├── entity: Supplier/Customer name
    ├── items: [{ productId, name, quantity, price, total }]
    ├── value: Total order value
    └── status: ['completed', 'processing', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

SalesOrder (salesOrder.model.js) - Modern
    ├── orderNumber: Auto-generated (SO00000001)
    ├── customer: ObjectId → Customer
    ├── items: [{ product, productName, sku, quantity, unitPrice, discount, total }]
    ├── subtotal, discountTotal, taxAmount, shippingAmount
    ├── total, paidAmount, dueAmount
    ├── paymentStatus: ['pending', 'partial', 'paid', 'refunded']
    ├── orderStatus: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    ├── paymentMethod: ['cash', 'card', 'bank_transfer', 'credit', 'upi', 'none']
    ├── paymentGateway: ['razorpay', 'stripe', 'paypal', 'none']
    ├── shippingDetails: { carrier, trackingNumber, trackingUrl, shippedDate, estimatedDelivery }
    ├── createdBy: ObjectId → User
    └── Auto-update customer stats on save

Invoice (invoice.model.js)
    ├── invoiceNumber: Auto-generated (INV-2026-000001)
    ├── salesOrderId: ObjectId → SalesOrder
    ├── customerId: ObjectId → Customer
    ├── items: [{ description, quantity, unitPrice, total }]
    ├── subtotal, taxAmount, discountTotal, total
    ├── status: ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    ├── dueDate: Required date
    ├── pdfUrl: Path to generated PDF
    ├── sentDate, paidDate
    └── notes, termsAndConditions

Payment (payment.model.js)
    ├── salesOrderId: ObjectId → SalesOrder
    ├── customerId: ObjectId → Customer
    ├── amount: Payment value
    ├── paymentMethod: ['cash', 'card', 'bank_transfer', 'credit', 'upi']
    ├── paymentGateway: ['razorpay', 'stripe', 'paypal', 'none']
    ├── transactionId: Unique (sparse)
    ├── status: ['pending', 'completed', 'failed', 'refunded']
    ├── paymentDate: Default now
    ├── receiptUrl
    └── notes, metadata

AccessRequest (accessRequest.model.js)
    ├── Used for user onboarding workflow

ActivityLog (activityLog.model.js)
    ├── High-fidelity audit trail

Role (role.model.js)
    ├── Permission management

Setting (role.model.js)
    ├── System configuration

Notification (notification.model.js)
    ├── User notifications

Session (session.model.js)
    ├── User session tracking

Report (report.model.js)
    ├── Analytics reports
```

### 1.2 Key Indexes

| Collection | Unique Indexes | Standard Indexes |
|------------|---------------|------------------|
| Product | productId, skuId | category, status |
| Customer | email, customerNumber | - |
| Supplier | code | status |
| SalesOrder | orderNumber | customer, orderStatus |
| Invoice | invoiceNumber | salesOrderId, status |
| Payment | transactionId | salesOrderId, status |
| Category | catName, slug | parent |

---

## 2. API Structure

### 2.1 Route Overview

```
/api/auth/*
    ├── POST /login
    ├── POST /register-root (initial setup)
    ├── POST /register-admin (admin creates admin)
    ├── POST /request-access (user requests access)
    ├── GET /me (current user)
    ├── PUT /update-profile
    ├── GET /logout
    ├── POST /send-otp
    ├── POST /verify-otp
    ├── POST /reset-password
    ├── GET /security-summary (admin)
    ├── GET /pending-requests (admin)
    ├── POST /approve/:id (admin)
    └── POST /reject/:id (admin)

/api/products/*
    ├── GET /all
    ├── GET /low-stock
    ├── POST /add (admin, root, manager)
    ├── PATCH /adjust-stock/:id (admin, root, manager, warehouse staff)
    ├── PUT /update/:id (admin, root, manager)
    └── DELETE /delete/:id (admin, root)

/api/categories/*
    ├── GET /all
    ├── POST /add (admin, root, manager)
    ├── PUT /update/:id
    └── DELETE /delete/:id

/api/suppliers/*
    ├── GET /all
    ├── POST /add
    ├── PUT /update/:id
    └── DELETE /delete/:id

/api/customers/*
    ├── GET /all
    ├── POST /add
    ├── PUT /update/:id
    └── DELETE /delete/:id

/api/orders/* (legacy)
    ├── GET /all
    ├── POST /add
    ├── PUT /update/:id
    └── DELETE /delete/:id

/api/sales-orders/*
    ├── GET /all
    ├── GET /:id
    ├── POST /create
    ├── PUT /update/:id
    ├── PATCH /update-status/:id
    └── DELETE /delete/:id

/api/invoices/*
    ├── GET /all
    ├── GET /:id
    ├── POST /create
    ├── PUT /update/:id
    ├── PATCH /send/:id
    └── DELETE /delete/:id

/api/payments/*
    ├── GET /all
    ├── GET /:id
    ├── POST /create
    └── GET /by-order/:orderId

/api/admin/*
    ├── GET /users
    ├── GET /users/:id
    ├── PUT /users/:id/role
    ├── DELETE /users/:id
    ├── GET /audit-logs
    └── GET /dashboard-stats
```

### 2.2 Middleware Stack

1. **Authentication** (`isAuth.middleware.js`)
   - JWT token validation
   - Cookie-based session check

2. **Authorization** (`role.middleware.js`)
   - Role-based access control (RBAC)
   - Permission checks

3. **File Upload** (`upload.middleware.js`)
   - Multer for multipart/form-data
   - Image handling for products

### 2.3 Controller Responsibilities

| Controller | Functions |
|------------|-----------|
| auth.controllers.js | login, register, requestAccess, approveRequest, rejectRequest, sendOtp, verifyOtp, resetPassword, getMe, updateMe, getSecuritySummary |
| product.controllers.js | addProduct, getAllProducts, updateProduct, deleteProduct, getLowStockProducts, adjustStock |
| category.controllers.js | CRUD operations for categories |
| supplier.controllers.js | CRUD operations for suppliers |
| customer.controllers.js | CRUD operations for customers |
| order.controllers.js | CRUD + stock adjustment for legacy orders |
| salesOrder.controllers.js | Modern order workflow with payment tracking |
| invoice.controllers.js | Invoice generation from sales orders |
| payment.controllers.js | Payment processing and tracking |
| admin.controllers.js | User management, audit logs, dashboard |

---

## 3. Frontend Architecture

### 3.1 Pages & Routes

```
/                           → Login
/root-register              → Initial root setup
/request-access             → User registration request
/reset-password             → Password reset
/dashboard                  → Main dashboard
/admin-dashboard            → Admin analytics
/inventory                  → Product listing
/inventory/add              → Add product
/inventory/:id/edit         → Edit product
/categories                 → Category management
/orders                     → Legacy order list
/orders/add                 → Create order
/orders/:id                 → Order details
/sales-orders               → Sales order list
/sales-orders/create        → Create sales order
/sales-orders/:id            → Sales order details
/invoices                   → Invoice management
/invoices/:id               → Invoice details
/customers                  → Customer list
/customers/add              → Add customer
/customers/:id              → Customer details
/suppliers                  → Supplier list
/suppliers/add              → Add supplier
/users                      → User management (admin)
/users/add                  → Add user (admin)
/user-approvals             → Access request approvals
/audit-logs                 → Activity logs
/reports                    → Analytics reports
/settings                   → System settings
```

### 3.2 Component Structure

```
components/layout/
├── MainLayout.jsx          → Authenticated layout wrapper
├── Sidebar.jsx             → Navigation sidebar
├── SideNavLinks.jsx        → Sidebar links
├── SideNavHeader.jsx       → Sidebar header with logo
├── Header.jsx              → Top header bar
├── SearchBar.jsx           → Global search
├── Notification.jsx        → Notification dropdown
├── NotificationBox.jsx     → Notification list
├── InventProLogo.jsx       → Logo component
└── AdminProfileButton.jsx  → User profile menu

components/ui/ (reusable)
├── Button.jsx
├── Input.jsx
├── Modal.jsx
├── Table.jsx
├── Card.jsx
├── Badge.jsx
├── Dropdown.jsx
└── ... more

pages/
├── Dashboard.jsx           → KPI charts & metrics
├── AdminDashboard.jsx      → Admin-level stats
├── Products.jsx           → Product grid/list
├── AddProduct.jsx          → Product form
├── Categories.jsx          → Category tree
├── Orders.jsx              → Order table
├── AddOrder.jsx            → Order creation
├── SalesOrders.jsx         → Sales order management
├── SalesOrderDetails.jsx   → Sales order view
├── Invoices.jsx            → Invoice list
├── Customers.jsx           → Customer directory
├── Suppliers.jsx          → Supplier list
├── UserManagement.jsx      → User CRUD
├── UserApprovals.jsx       → Access requests
├── AuditLogs.jsx          → Activity stream
├── Reports.jsx            → Analytics
├── Settings.jsx           → Configuration
├── Login.jsx              → Authentication
├── RequestAccess.jsx      → Registration
└── ... more forms
```

### 3.3 State Management (Redux Toolkit)

```
store.js                    → Configure store
slices/
├── authSlice.js           → User auth state
├── productSlice.js        → Products & inventory
├── orderSlice.js          → Orders
├── salesOrderSlice.js     → Sales orders
├── customerSlice.js       → Customers
├── supplierSlice.js       → Suppliers
├── categorySlice.js       → Categories
├── uiSlice.js              → UI state (modals, sidebar)
└── settingsSlice.js       → System settings
```

### 3.4 Styling & Theme

- **Design System**: Dark Luxury
  - Background: `#050505`
  - Primary: Purple-600
  - Accent: Cyan-600
  - Glassmorphism with backdrop blur
- **CSS**: Tailwind CSS 4
- **Animation**: Framer Motion
- **Icons**: Lucide React

---

## 4. Features & Business Logic

### 4.1 Core Features

#### Authentication & Authorization
- JWT-based authentication with cookies
- OTP verification for password reset
- Role-based access control (7 roles)
- Access request workflow (request → approve/reject)
- Session management

#### Inventory Management
- Product CRUD with image upload
- Stock level tracking with low stock alerts
- SKU and barcode support
- Category hierarchy (parent/child)
- Stock adjustment with audit trail

#### Order Management
- Legacy orders (inward/outward)
- Modern sales orders with:
  - Customer selection
  - Product line items
  - Pricing and discounts
  - Tax calculation
  - Payment status tracking
  - Shipping details

#### Invoice & Payment
- Auto-generated invoice numbers
- Invoice generation from sales orders
- Payment tracking (partial payments)
- Payment methods: cash, card, bank transfer, UPI
- Gateway integration ready (Razorpay, Stripe, PayPal)

#### Customer Management
- Business/individual customer types
- Credit limit and balance tracking
- Order history aggregation
- Address management (billing/shipping)

#### Supplier Management
- Supplier reliability scoring
- Category association
- Contact management

#### Reporting & Analytics
- Dashboard KPIs
- Sales analytics
- Inventory reports
- Audit logs

### 4.2 Business Flows

#### User Onboarding Flow
```
1. User visits /request-access
2. Fills registration form
3. Submits access request
4. Admin views pending requests at /user-approvals
5. Admin approves/rejects request
6. If approved, user receives login credentials
7. User logs in and updates password
```

#### Order-to-Invoice Flow
```
1. Create Sales Order with customer and items
2. System calculates totals (subtotal, tax, discount)
3. Update order status (draft → confirmed → processing → shipped → delivered)
4. Create Invoice from Sales Order
5. Process Payment against Invoice
6. Update payment status (pending → partial → paid)
```

#### Stock Management Flow
```
1. Add product with initial quantity
2. System auto-calculates status (in stock / low stock / out of stock)
3. Create inward order → increases stock
4. Create outward order → decreases stock
5. Low stock triggers alert when qty < threshold
```

### 4.3 Edge Cases Handled

- Auto-increment for invoice/order/customer numbers
- Unique constraints with sparse indexes
- Customer balance updates on order completion
- Stock validation (prevent negative inventory)
- Order status transitions validation

---

## 5. Project Structure

```
Major_Project_InventPro/
├── backend/
│   ├── config/
│   │   └── db.js              → MongoDB connection
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── product.controllers.js
│   │   ├── category.controllers.js
│   │   ├── supplier.controllers.js
│   │   ├── customer.controllers.js
│   │   ├── order.controllers.js
│   │   ├── salesOrder.controllers.js
│   │   ├── invoice.controllers.js
│   │   ├── payment.controllers.js
│   │   └── admin.controllers.js
│   ├── middleware/
│   │   ├── isAuth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── auth.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── supplier.model.js
│   │   ├── customer.model.js
│   │   ├── order.model.js
│   │   ├── salesOrder.model.js
│   │   ├── invoice.model.js
│   │   ├── payment.model.js
│   │   ├── activityLog.model.js
│   │   ├── accessRequest.model.js
│   │   ├── role.model.js
│   │   ├── setting.model.js
│   │   ├── notification.model.js
│   │   ├── session.model.js
│   │   └── report.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── supplier.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js
│   │   ├── salesOrder.routes.js
│   │   ├── invoice.routes.js
│   │   ├── payment.routes.js
│   │   ├── admin.routes.js
│   │   └── setting.routes.js
│   ├── utils/
│   │   ├── pdf.utils.js
│   │   ├── email.utils.js
│   │   ├── notification.utils.js
│   │   └── logger.utils.js
│   ├── socket/
│   │   └── socket.js         → Real-time updates
│   ├── uploads/              → Uploaded images
│   ├── server.js             → Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   ├── services/
│   │   │   └── api.js        → Axios instance
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docs/
│   ├── token-optimization-guide.md
│   ├── runbook.md
│   └── model-selection-playbook.md
│
├── PRD/
│   └── PRD.md
│
├── WORKFLOW.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── STACK.md
├── README.md
├── IMPLEMENTATION_REPORT.md
└── PROJECT_RULES.md
```

---

## 6. Configuration

### Environment Variables

```env
# Backend
PORT=3000
MONGO_URI=mongodb://localhost:27017/inventpro
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

# Frontend
VITE_API_URL=http://localhost:3000/api
```

---

## 7. Technical Considerations

### Performance Targets
- Page Load: < 2 seconds
- API Response: < 200ms
- Concurrent Users: 1,000

### Security Measures
- JWT tokens with expiration
- Password hashing (bcrypt)
- Role-based middleware
- Input validation
- XSS/CORS protection

### Scalability
- Modular MVC architecture
- MongoDB for flexible schema
- RESTful API design
- Redux for state optimization