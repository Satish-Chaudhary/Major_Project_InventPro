# InventPro - User Manual

> Version: 1.0.0  
> Last Updated: April 4, 2026

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Dashboard](#dashboard)
4. [Inventory Management](#inventory-management)
5. [Orders & Sales](#orders--sales)
6. [Customers](#customers)
7. [Suppliers](#suppliers)
8. [Reports & Analytics](#reports--analytics)
9. [Settings](#settings)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup

1. **Register Root User**
   - Navigate to `/register-root`
   - Fill in your details (name, email, password)
   - This creates the first admin account

2. **Access the Application**
   - Go to `/login`
   - Enter your credentials
   - You'll be redirected to the dashboard

### Navigation

- **Sidebar**: Primary navigation on the left
- **Header**: Search, notifications, and profile menu
- **Breadcrumbs**: Page location indicator

---

## User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **Root** | Full system access, can create admin accounts |
| **Admin** | User management, settings, all operations |
| **Manager** | Inventory, orders, reports management |
| **Accountant** | Financial reports, invoices, payments |
| **Sales Staff** | Create orders, manage customers |
| **Warehouse Staff** | Stock adjustments, receive shipments |
| **Staff** | View-only access to dashboard |

### Access Request Workflow

1. New users visit `/request-access`
2. Fill out the registration form
3. Admin reviews requests at `/approvals`
4. Approved users receive login credentials

---

## Dashboard

### Main Dashboard (`/dashboard`)

The main dashboard displays:
- **Total Products**: Count of all products
- **Low Stock Items**: Products below threshold
- **Total Orders**: All-time order count
- **Revenue**: Total sales revenue

### Charts
- Sales trend over time
- Top products by revenue
- Category distribution

### Admin Dashboard (`/admin-dashboard`)
- System health metrics
- User activity
- Audit logs access

---

## Inventory Management

### Products (`/inventory`)

**View Products**
- Search by name, SKU, or barcode
- Filter by category and status
- Sort by name, price, stock
- Pagination with 10 items per page

**Add Product**
1. Click "Add Product" button
2. Fill in product details:
   - Product Name (required)
   - SKU ID (unique)
   - Category
   - Initial Quantity
   - Base Price (selling price)
   - Cost Price (purchase price)
   - Low Stock Threshold
3. Upload product image (optional)
4. Click "Save"

**Edit Product**
- Click the edit icon on any product row
- Modify details in the modal
- Save changes

**Delete Product**
- Click the delete icon
- Confirm deletion in the popup
- Note: This cannot be undone

**Adjust Stock**
- Click the settings icon on a product
- Enter adjustment quantity (+/-)
- Select reason (Purchase, Sale, Adjustment, Damaged, Return)
- Add optional notes

**Bulk Import**
1. Click "Import" button
2. Upload a CSV file
3. Preview products before import
4. Click "Import" to add products

**Export**
1. Click "Export CSV"
2. Download starts automatically
3. File contains all product data

### Categories (`/categories`)

- Create hierarchical categories
- Assign products to categories
- Filter inventory by category

---

## Orders & Sales

### Sales Orders (`/sales-orders`)

**Create Sales Order**
1. Go to Cart or click "New Checkout"
2. Add products from inventory
3. Select customer
4. Apply discounts (optional)
5. Review totals and taxes
6. Confirm order

**Order Status Flow**
```
Draft → Confirmed → Processing → Shipped → Delivered
                                    ↓
                                Cancelled
```

**Payment Status**
```
Pending → Partial → Paid
```

### Invoices (`/invoices`)

- Auto-generated from sales orders
- Includes itemized list, taxes, totals
- Can be sent to customers via email
- Tracks payment status

### Legacy Orders (`/orders`)

- Simple inward/outward transactions
- Track stock movements
- View order history

---

## Customers

### Customer CRM (`/customers`)

**Add Customer**
1. Click "Add Customer"
2. Fill in details:
   - Name (required)
   - Email (unique)
   - Phone
   - Customer Type (Individual/Business)
   - Company Name (if business)
   - Billing/Shipping Address
   - Credit Limit
3. Save customer

**View Customer**
- Order history
- Total spent
- Current balance
- Credit status

---

## Suppliers

### Vendor Registry (`/suppliers`)

**Add Supplier**
1. Click "Add Supplier"
2. Fill in details:
   - Company Name
   - Supplier Code
   - Contact Person
   - Email, Phone
   - Categories supplied
3. Set reliability score

### Purchase Orders (`/purchase-orders`)

**Create PO**
1. Click "Create PO"
2. Select supplier
3. Add products and quantities
4. Set expected delivery date
5. Submit for approval

**Receive PO**
1. Navigate to PO details
2. Click "Receive Items"
3. Mark items as received
4. Stock is automatically updated

---

## Reports & Analytics

### Available Reports

| Report | Path | Description |
|--------|------|-------------|
| Stock Movement | `/stock-movement` | Track inventory changes |
| Inventory Valuation | `/inventory-valuation` | Total inventory value |
| Sales Performance | `/sales-performance` | Revenue analytics |
| Vendor Performance | `/vendor-performance` | Supplier metrics |
| Profit & Loss | `/profit-loss` | Financial overview |

### Export
- Each report has an "Export CSV" button
- Download data for external analysis

---

## Settings

### General Settings
- Company Name
- Support Email
- Address

### Administration
Quick links to:
- Admin Dashboard
- User Management
- Roles & Security
- Audit Logs

### Notifications (`/notification-settings`)
- Low stock alerts
- Order notifications
- Email vs In-app preferences
- Scheduled reports

### Backup & Export (`/backup-export`)
- Export all data as JSON
- View database statistics

---

## Troubleshooting

### Common Issues

**Login Issues**
- Ensure credentials are correct
- Clear browser cache and cookies
- Check if account is active (not pending/rejected)

**Cannot Access a Page**
- Your role may not have permission
- Contact admin for access

**Product Not Found**
- Check SKU is unique
- Verify category assignment

**Stock Negative**
- Review stock adjustments
- Check order processing

**Email Not Sending**
- Verify SMTP configuration
- Check server logs

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + K | Global search |
| Ctrl/Cmd + N | New product |
| Ctrl/Cmd + O | New order |
| Ctrl/Cmd + D | Dashboard |
| Ctrl/Cmd + I | Inventory |
| Ctrl/Cmd + , | Settings |
| Esc | Close modal |

### Getting Help

1. Check audit logs for errors (`/audit`)
2. Review system settings
3. Contact system administrator
4. Check server logs

---

## Appendix

### Data Fields

**Product**
- productName, skuId, barcodeEAN
- initialQty, lowStockThreshold
- basePrice, costPrice, tax
- status (in stock/low stock/out of stock)

**Order**
- orderNumber, type (inward/outward)
- items[], value, status

**Customer**
- customerNumber, name, email
- creditLimit, currentBalance, totalSpent

---

*This user manual was created for InventPro v1.0.0*