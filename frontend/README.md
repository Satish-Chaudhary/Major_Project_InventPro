# InventPro - Frontend

A modern inventory management system built with React, Redux Toolkit, and Tailwind CSS.

## Tech Stack

- **Framework**: React 19
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Testing**: Vitest

## Features

### Core Features
- Product Management (CRUD, bulk import, stock adjustment)
- Sales Order Management
- Supplier/Vendor Management
- Customer Management
- Purchase Order Management
- Category Management
- Invoice Generation
- Shopping Cart & Checkout

### Reports & Analytics
- **Dashboard**: Real-time summary with charts
- **Stock Movement Report**: Track inventory changes
- **Inventory Valuation Report**: Total inventory value breakdown
- **Sales Performance Report**: Revenue analytics and trends
- **Vendor Performance Report**: Supplier metrics
- **Profit & Loss Report**: Financial performance and margins

### Export Features
- Export Configuration with data source selection
- Date range filtering
- Column selection
- Multiple formats (CSV, Excel, PDF)
- Recent exports history

### Additional Features
- Real-time Notifications
- Global Search (Ctrl+K)
- Role-based Access Control
- Dark Mode UI
- Keyboard Shortcuts
- Lazy Loading & Performance Optimization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AdjustStockModal.jsx
│   │   ├── BulkImportModal.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── GlobalSearch.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── NotificationCenter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Sidebar.jsx
│   ├── config/               # Configuration files
│   │   └── api.js
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── AddProduct.jsx
│   │   ├── Suppliers.jsx
│   │   ├── Customers.jsx
│   │   ├── Orders.jsx
│   │   ├── SalesOrders.jsx
│   │   ├── PurchaseOrders.jsx
│   │   ├── Reports.jsx
│   │   ├── StockMovement.jsx
│   │   ├── InventoryValuation.jsx
│   │   ├── SalesPerformance.jsx
│   │   ├── VendorPerformance.jsx
│   │   ├── ProfitLoss.jsx
│   │   └── Settings.jsx
│   ├── redux/                # Redux store, slices, API
│   │   ├── store.js
│   │   ├── hooks.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── productSlice.js
│   │       ├── orderSlice.js
│   │       ├── salesOrderSlice.js
│   │       ├── customerSlice.js
│   │       ├── vendorSlice.js
│   │       ├── categorySlice.js
│   │       ├── reportSlice.js
│   │       ├── notificationSlice.js
│   │       ├── uiSlice.js
│   │       └── activitySlice.js
│   ├── utils/                # Utility functions
│   │   ├── exportUtils.js
│   │   └── statusBadges.js
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── package.json
└── vite.config.js
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage |

## API Integration

The frontend communicates with the backend API at the URL specified in `VITE_API_URL`. Key API endpoints:

### Products
- `GET /api/products/all` - Get all products
- `POST /api/products/add` - Create product
- `PUT /api/products/update/:id` - Update product
- `DELETE /api/products/delete/:id` - Delete product
- `PATCH /api/products/adjust-stock/:id` - Adjust stock
- `POST /api/products/bulk-import` - Bulk import
- `GET /api/products/export` - Export products

### Orders
- `GET /api/orders/all` - Get all orders
- `POST /api/orders/add` - Create order
- `PUT /api/orders/update/:id` - Update order

### Sales Orders
- `GET /api/sales-orders/all` - Get all sales orders
- `POST /api/sales-orders/create` - Create sales order
- `PATCH /api/sales-orders/status/:id` - Update status

### Suppliers
- `GET /api/suppliers/all` - Get all suppliers
- `POST /api/suppliers/add` - Add supplier
- `PUT /api/suppliers/update/:id` - Update supplier

### Customers
- `GET /api/customers/all` - Get all customers
- `POST /api/customers/add` - Add customer
- `PUT /api/customers/update/:id` - Update customer

### Categories
- `GET /api/categories/all` - Get all categories
- `POST /api/categories/add` - Create category

### Reports
- `GET /api/reports/summary` - Get summary report
- `GET /api/reports/recent-exports` - Get recent exports
- `POST /api/reports/log-download` - Log export action

## Redux Store

The application uses Redux Toolkit with RTK Query for API caching and state management.

### Key Slices

| Slice | Description |
|-------|-------------|
| `authSlice` | Authentication state, user info |
| `productSlice` | Products API and filters |
| `orderSlice` | Orders API and cart state |
| `salesOrderSlice` | Sales orders API |
| `customerSlice` | Customers API |
| `vendorSlice` | Suppliers/vendors API |
| `categorySlice` | Categories API |
| `reportSlice` | Reports API |
| `notificationSlice` | Real-time notifications |
| `uiSlice` | UI state (modals, sidebar) |
| `activitySlice` | Activity/audit logs |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open global search |
| `Ctrl + N` | New product |
| `Escape` | Close modals |

## License

MIT