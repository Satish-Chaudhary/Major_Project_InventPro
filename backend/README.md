# InventPro - Backend

A comprehensive RESTful API backend for the InventPro inventory management system built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: Nodemailer
- **PDF Generation**: PDFKit

## Features

### Core Features
- User Authentication & Authorization (JWT + Role-based)
- Product Management with stock tracking
- Order Management (Purchase & Sales Orders)
- Supplier/Vendor Management
- Customer Management
- Category Management
- Invoice Generation
- Payment Processing (Stripe, Razorpay, PayPal)
- Real-time Notifications (Socket.io)
- Activity Logging & Audit Trail

### Reports & Analytics
- Dashboard Summary Report
- Stock Movement Report
- Inventory Valuation Report
- Sales Performance Report
- Vendor Performance Report
- Profit & Loss Report
- Data Export (CSV, Excel, PDF)
- Download History Tracking

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the server
npm run server
```

### Environment Variables

Create a `.env` file in the backend root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/inventpro

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Razorpay
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

# PayPal
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/otp/send` | Send OTP |
| POST | `/api/auth/otp/verify` | Verify OTP |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/all` | Get all products (paginated) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products/add` | Create product |
| PUT | `/api/products/update/:id` | Update product |
| DELETE | `/api/products/delete/:id` | Delete product |
| PATCH | `/api/products/adjust-stock/:id` | Adjust stock |
| POST | `/api/products/bulk-import` | Bulk import |
| GET | `/api/products/export` | Export products |
| GET | `/api/products/low-stock` | Get low stock items |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/all` | Get all orders |
| POST | `/api/orders/add` | Create order |
| PUT | `/api/orders/update/:id` | Update order |
| DELETE | `/api/orders/delete/:id` | Delete order |

### Sales Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales-orders/all` | Get all sales orders |
| POST | `/api/sales-orders/create` | Create sales order |
| GET | `/api/sales-orders/:id` | Get sales order |
| PATCH | `/api/sales-orders/status/:id` | Update status |
| GET | `/api/sales-orders/customer/:id` | Customer orders |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers/all` | Get all suppliers |
| POST | `/api/suppliers/add` | Add supplier |
| PUT | `/api/suppliers/update/:id` | Update supplier |
| DELETE | `/api/suppliers/delete/:id` | Delete supplier |

### Purchase Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchase-orders/all` | Get all POs |
| POST | `/api/purchase-orders/add` | Create PO |
| POST | `/api/purchase-orders/receive/:id` | Receive items |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers/all` | Get all customers |
| POST | `/api/customers/add` | Add customer |
| PUT | `/api/customers/update/:id` | Update customer |
| DELETE | `/api/customers/delete/:id` | Delete customer |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/all` | Get all categories |
| POST | `/api/categories/add` | Create category |
| PUT | `/api/categories/update/:id` | Update category |
| DELETE | `/api/categories/delete/:id` | Delete category |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/summary` | Dashboard summary |
| GET | `/api/reports/all` | Report schedules |
| GET | `/api/reports/recent-exports` | Download history |
| POST | `/api/reports/log-download` | Log export |
| POST | `/api/reports/add` | Create schedule |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/health` | Health check |
| GET | `/api/system/metrics` | System metrics |
| GET | `/api/system/stats/dashboard` | Dashboard stats |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/all` | My notifications |
| PUT | `/api/notifications/read/:id` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all read |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/get` | Get settings |
| POST | `/api/settings/update` | Update settings |
| GET | `/api/settings/system-stats` | System stats |

## User Roles

| Role | Permissions |
|------|-------------|
| Root | Full system access |
| Admin | Full CRUD, manage users |
| Manager | CRUD on most resources |
| Accountant | View reports, manage invoices |
| Sales | Create orders, manage customers |
| Warehouse | Manage inventory, stock |
| Viewer | Read-only access |

## Real-time Features

Socket.io events:
- `stock:updated` - Stock level changes
- `order:new` - New order created
- `notification:new` - New notification

## Project Structure

```
backend/
├── config/             # Database configuration
├── controllers/       # Route handlers
│   ├── admin/         # Admin controllers
│   ├── auth.controllers.js
│   ├── category.controllers.js
│   ├── customer.controllers.js
│   ├── invoice.controllers.js
│   ├── notification.controllers.js
│   ├── order.controllers.js
│   ├── product.controllers.js
│   ├── purchaseOrder.controllers.js
│   ├── report.controllers.js
│   ├── salesOrder.controllers.js
│   ├── setting.controllers.js
│   ├── supplier.controllers.js
│   └── system.controllers.js
├── middleware/        # Custom middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── socket/            # Socket.io configuration
├── utils/             # Utility functions
├── scripts/           # Database seed scripts
├── server.js          # Application entry point
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run server` | Start server with nodemon |
| `npm run seed` | Seed database with sample data |

## License

MIT