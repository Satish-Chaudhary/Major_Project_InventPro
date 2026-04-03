# InventPro API Documentation

> Version: 1.0.0  
> Last Updated: April 4, 2026

---

## Base URL
```
http://localhost:3000/api
```

---

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register-root` | Register root user (first user) |
| POST | `/auth/register-admin` | Register admin (root only) |
| POST | `/auth/request-access` | Request system access |
| POST | `/auth/send-otp` | Send OTP for password reset |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/reset-password` | Reset password |

### Protected Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/auth/me` | Get current user | All |
| PUT | `/auth/update-profile` | Update profile | All |
| GET | `/auth/logout` | Logout | All |
| GET | `/auth/pending-requests` | Get pending access requests | admin, root |
| POST | `/auth/approve/:id` | Approve access request | admin, root |
| POST | `/auth/reject/:id` | Reject access request | admin, root |
| GET | `/auth/security-summary` | Get security stats | admin, root |

---

## Products

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/products/all` | Get all products | All |
| GET | `/products/low-stock` | Get low stock products | All |
| GET | `/products/export` | Export products CSV | admin, root, accountant |
| POST | `/products/add` | Add new product | admin, root, manager |
| POST | `/products/bulk-import` | Bulk import products | admin, root, manager |
| PATCH | `/products/adjust-stock/:id` | Adjust stock | admin, root, manager, warehouse staff |
| PUT | `/products/update/:id` | Update product | admin, root, manager |
| DELETE | `/products/delete/:id` | Delete product | admin, root |

### Query Parameters (GET /products/all)

```javascript
{
  page: 1,           // Page number
  limit: 10,         // Items per page
  search: '',        // Search by name, SKU
  category: '',      // Filter by category
  status: '',        // Filter by status
  sort: 'createdAt',// Sort field
  order: 'desc'      // Sort order (asc/desc)
}
```

### Response Example
```json
{
  "success": true,
  "products": [
    {
      "_id": "abc123",
      "productName": "Product Name",
      "skuId": "SKU001",
      "initialQty": 100,
      "basePrice": 99.99,
      "status": "in stock"
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

### Request Body (POST /products/add)

```json
{
  "productName": "Product Name",
  "skuId": "SKU001",
  "productDescription": "Description",
  "category": ["category_id"],
  "brand": "Brand",
  "initialQty": 100,
  "lowStockThreshold": 10,
  "basePrice": 99.99,
  "costPrice": 50.00,
  "tax": 10,
  "productImage": "file"
}
```

---

## Categories

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/categories/all` | Get all categories | All |
| POST | `/categories/add` | Add category | admin, root, manager |
| PUT | `/categories/update/:id` | Update category | admin, root, manager |
| DELETE | `/categories/delete/:id` | Delete category | admin, root |

---

## Suppliers (Vendors)

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/suppliers/all` | Get all suppliers | All |
| GET | `/suppliers/:id` | Get supplier by ID | All |
| POST | `/suppliers/add` | Add supplier | admin, root, manager |
| PUT | `/suppliers/update/:id` | Update supplier | admin, root, manager |
| DELETE | `/suppliers/delete/:id` | Delete supplier | admin, root |

---

## Purchase Orders

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/purchase-orders/all` | Get all POs | All |
| GET | `/purchase-orders/:id` | Get PO by ID | All |
| POST | `/purchase-orders/add` | Create PO | admin, root, manager, accountant |
| PUT | `/purchase-orders/update/:id` | Update PO | admin, root, manager |
| DELETE | `/purchase-orders/delete/:id` | Delete PO | admin, root |
| POST | `/purchase-orders/receive/:id` | Receive PO items | admin, root, manager, warehouse |

---

## Orders (Legacy)

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/orders/all` | Get all orders | All |
| GET | `/orders/:id` | Get order by ID | All |
| POST | `/orders/add` | Create order | admin, root, manager, sales staff |
| PUT | `/orders/update/:id` | Update order | admin, root, manager |
| DELETE | `/orders/delete/:id` | Delete order | admin, root |

---

## Sales Orders

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/sales-orders/all` | Get all sales orders | All |
| GET | `/sales-orders/:id` | Get sales order by ID | All |
| POST | `/sales-orders/create` | Create sales order | admin, root, manager, sales staff |
| PUT | `/sales-orders/update/:id` | Update sales order | admin, root, manager |
| PATCH | `/sales-orders/update-status/:id` | Update order status | admin, root, manager |
| DELETE | `/sales-orders/delete/:id` | Delete sales order | admin, root |

---

## Customers

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/customers/all` | Get all customers | All |
| GET | `/customers/:id` | Get customer by ID | All |
| POST | `/customers/add` | Add customer | admin, root, manager, sales staff |
| PUT | `/customers/update/:id` | Update customer | admin, root, manager, sales staff |
| DELETE | `/customers/delete/:id` | Delete customer | admin, root |

---

## Invoices

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/invoices/all` | Get all invoices | All |
| GET | `/invoices/:id` | Get invoice by ID | All |
| POST | `/invoices/create` | Create invoice | admin, root, accountant, manager |
| PUT | `/invoices/update/:id` | Update invoice | admin, root, accountant |
| PATCH | `/invoices/send/:id` | Send invoice | admin, root, accountant |
| DELETE | `/invoices/delete/:id` | Delete invoice | admin, root |

---

## Payments

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/payments/all` | Get all payments | All |
| GET | `/payments/:id` | Get payment by ID | All |
| POST | `/payments/create` | Create payment | All |
| GET | `/payments/by-order/:orderId` | Get payments by order | All |

---

## Admin

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/admin/users` | Get all users | admin, root |
| GET | `/admin/users/:id` | Get user by ID | admin, root |
| PUT | `/admin/users/:id/role` | Update user role | admin, root |
| DELETE | `/admin/users/:id` | Delete user | admin, root |
| GET | `/admin/audit-logs` | Get audit logs | admin, root |
| GET | `/admin/dashboard-stats` | Get dashboard stats | admin, root |

---

## Settings

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/settings` | Get all settings | admin, root |
| PUT | `/settings` | Update settings | admin, root |
| GET | `/settings/stats` | Get system stats | admin, root |

---

## Backup

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/backup/export` | Export all data as JSON | admin, root |
| GET | `/backup/stats` | Get database statistics | admin, root |

---

## Notification Settings

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|--------------|---------------|
| GET | `/notifications/all` | Get all notifications | All |
| GET | `/notifications/unread` | Get unread notifications | All |
| PATCH | `/notifications/:id/read` | Mark as read | All |
| DELETE | `/notifications/:id` | Delete notification | All |

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev only)"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Roles

| Role | Permissions |
|------|-------------|
| root | Full system access |
| admin | System administration |
| manager | Manage inventory & orders |
| accountant | Financial operations |
| sales staff | Sales operations |
| warehouse staff | Stock management |
| staff | Basic access |

---

*This API documentation was auto-generated for InventPro v1.0.0*