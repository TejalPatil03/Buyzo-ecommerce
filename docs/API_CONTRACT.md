# BuyZo Marketplace — API Contract

All responses conform to the standard API response envelope:
```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable success description",
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

Error response envelope:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Specific error description",
    "details": []
  }
}
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/signup`
* **Auth**: Public
* **Request**:
  ```json
  {
    "fullName": "Priya Patel",
    "email": "priya.patel@apexretail.in",
    "phone": "9823456789",
    "password": "securepassword123",
    "role": "seller",
    "sellerStoreName": "Apex Electronics & Fashion Hub",
    "gstin": "27AADCB2230M1Z2",
    "city": "Mumbai"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "usr-xxx", "fullName": "Priya Patel", "email": "...", "role": "seller" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/v1/auth/login`
* **Auth**: Public
* **Request**: `{ "email": "user@example.com", "password": "password" }`
* **Response (200 OK)**: `{ "success": true, "data": { "user": {...}, "token": "..." } }`

### `POST /api/v1/auth/send-otp`
* **Auth**: Public
* **Request**: `{ "phone": "9820145678", "method": "phone" }`
* **Response (200 OK)**: `{ "success": true, "message": "OTP sent successfully" }`

### `POST /api/v1/auth/verify-otp`
* **Auth**: Public
* **Request**:
  ```json
  {
    "identifier": "9820145678",
    "otp": "123456",
    "role": "customer",
    "fullName": "Tejal Patil",
    "city": "Mumbai"
  }
  ```
* **Response (200 OK)**: `{ "success": true, "data": { "user": {...}, "token": "..." } }`

### `POST /api/v1/auth/quick-demo`
* **Auth**: Public (Development & Instant Demo Testing)
* **Request**: `{ "role": "customer" | "seller" | "admin" }`
* **Response (200 OK)**: `{ "success": true, "data": { "user": {...}, "token": "..." } }`

### `GET /api/v1/auth/me`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": { "user": {...} } }`

---

## 2. Products & Categories Endpoints (`/api/v1/products`, `/api/v1/categories`)

### `GET /api/v1/products`
* **Auth**: Public
* **Query Params**:
  * `q` (string): Search query
  * `category` (string): e.g. "Fashion", "Mobiles"
  * `brand` (string): Brand name filter
  * `minPrice` (number), `maxPrice` (number)
  * `inStock` (boolean)
  * `sort` ("price_asc" | "price_desc" | "rating" | "newest")
  * `page` (number, default: 1), `limit` (number, default: 20)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [ { "id": "prod-1", "name": "...", "price": 4999, ... } ],
    "meta": { "total": 12, "page": 1, "limit": 20 }
  }
  ```

### `GET /api/v1/products/:id`
* **Auth**: Public
* **Response (200 OK)**: `{ "success": true, "data": { "product": {...} } }`

### `GET /api/v1/categories`
* **Auth**: Public
* **Response (200 OK)**: `{ "success": true, "data": [ { "id": "cat-fashion", "name": "Fashion", ... } ] }`

---

## 3. Cart Endpoints (`/api/v1/cart`)

### `GET /api/v1/cart`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": { "items": [ { "product": {...}, "quantity": 1 } ] } }`

### `POST /api/v1/cart/items`
* **Auth**: Bearer Token
* **Request**: `{ "productId": "prod-titan-watch", "quantity": 1, "selectedColor": "Black", "selectedSize": "Standard" }`
* **Response (200 OK)**: `{ "success": true, "data": { "items": [...] } }`

### `PUT /api/v1/cart/items/:productId`
* **Auth**: Bearer Token
* **Request**: `{ "quantity": 2 }`
* **Response (200 OK)**: `{ "success": true, "data": { "items": [...] } }`

### `DELETE /api/v1/cart/items/:productId`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": { "items": [...] } }`

### `DELETE /api/v1/cart`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "message": "Cart cleared" }`

---

## 4. Address Endpoints (`/api/v1/addresses`)

### `GET /api/v1/addresses`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": [ {...} ] }`

### `POST /api/v1/addresses`
* **Auth**: Bearer Token
* **Request**:
  ```json
  {
    "fullName": "Tejal Patil",
    "phone": "+91 98201 45678",
    "addressLine1": "Flat 402, Sunshine Heights",
    "addressLine2": "Near Hiranandani",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400076",
    "isDefault": true,
    "type": "Home"
  }
  ```
* **Response (201 Created)**: `{ "success": true, "data": { "address": {...} } }`

### `PUT /api/v1/addresses/:id`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": { "address": {...} } }`

### `DELETE /api/v1/addresses/:id`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "message": "Address deleted" }`

---

## 5. Order Endpoints (`/api/v1/orders`)

### `GET /api/v1/orders`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": [ {...} ] }`

### `GET /api/v1/orders/:id`
* **Auth**: Bearer Token
* **Response (200 OK)**: `{ "success": true, "data": { "order": {...} } }`

### `POST /api/v1/orders`
* **Auth**: Bearer Token
* **Request**:
  ```json
  {
    "items": [ { "productId": "prod-titan-watch", "quantity": 1 } ],
    "deliveryAddress": { "fullName": "...", "phone": "...", "addressLine1": "...", "city": "...", "pincode": "..." },
    "paymentMethod": "UPI (Google Pay)",
    "paymentDetails": {
      "method": "UPI",
      "subMethod": "Google Pay",
      "transactionRef": "TXN-BZ-12345678",
      "amount": 4999,
      "status": "Success"
    }
  }
  ```
* **Response (201 Created)**: `{ "success": true, "data": { "order": {...} } }`

### `POST /api/v1/orders/:id/cancel`
* **Auth**: Bearer Token
* **Request**: `{ "reason": "Customer requested cancellation" }`
* **Response (200 OK)**: `{ "success": true, "data": { "order": {...} } }`

### `POST /api/v1/orders/:id/return`
* **Auth**: Bearer Token
* **Request**: `{ "reason": "Fit issue or defective item" }`
* **Response (200 OK)**: `{ "success": true, "data": { "order": {...} } }`

---

## 6. Payment Processing Endpoints (`/api/v1/payments`)

### `POST /api/v1/payments/process`
* **Auth**: Bearer Token
* **Request**:
  ```json
  {
    "amount": 4999,
    "method": "UPI" | "Card" | "NetBanking" | "COD" | "Wallet" | "PayLater",
    "subMethod": "Google Pay",
    "upiVpa": "rahul@okhdfcbank",
    "cardLast4": "9982"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "transaction": {
        "id": "tx-123456",
        "status": "Success",
        "transactionRef": "TXN-BZ-89412345",
        "bankRef": "RRN-458912304918",
        "timestamp": "11:30:00 AM"
      }
    }
  }
  ```

---

## 7. Seller Hub Endpoints (`/api/v1/seller`)

* **Authorization**: `role: "seller"` or `role: "admin"`

### `GET /api/v1/seller/products`
* **Response (200 OK)**: `{ "success": true, "data": [ {...} ] }`

### `POST /api/v1/seller/products`
* **Request**: New product object payload with name, category, price, stockCount, brand, description, specifications.
* **Response (201 Created)**: `{ "success": true, "data": { "product": {...} } }`

### `PUT /api/v1/seller/products/:id/stock`
* **Request**: `{ "stockCount": 75 }`
* **Response (200 OK)**: `{ "success": true, "data": { "product": {...} } }`

### `GET /api/v1/seller/orders`
* **Response (200 OK)**: `{ "success": true, "data": [ {...} ] }`

### `PUT /api/v1/seller/orders/:id/status`
* **Request**: `{ "status": "Processing" | "Shipped" | "Out for Delivery" | "Delivered" }`
* **Response (200 OK)**: `{ "success": true, "data": { "order": {...} } }`

### `GET /api/v1/seller/analytics`
* **Response (200 OK)**: `{ "success": true, "data": { "totalGMV": 482000, "activeOrders": 12, "lowStockItems": 2 } }`

---

## 8. Super Admin Governance Endpoints (`/api/v1/admin`)

* **Authorization**: `role: "admin"`

### `GET /api/v1/admin/kpis`
* **Response (200 OK)**: `{ "success": true, "data": { "platformGMV": 1424999, "verifiedSellers": 428, "pendingReturns": 3, "activeListings": 4680 } }`

### `GET /api/v1/admin/returns`
* **Response (200 OK)**: `{ "success": true, "data": [ {...} ] }`

### `POST /api/v1/admin/returns/:orderId/approve`
* **Response (200 OK)**: `{ "success": true, "data": { "order": {...} } }`

### `POST /api/v1/admin/returns/:orderId/reject`
* **Request**: `{ "reason": "Non-compliant return window" }`
* **Response (200 OK)**: `{ "success": true, "data": { "order": {...} } }`

### `GET /api/v1/admin/sellers`
* **Response (200 OK)**: `{ "success": true, "data": [ {...} ] }`

### `PUT /api/v1/admin/sellers/:id/status`
* **Request**: `{ "status": "Approved" | "Suspended" | "Under Review" }`
* **Response (200 OK)**: `{ "success": true, "data": { "seller": {...} } }`

---

## 9. AI Shopping Assistant (`/api/v1/assistant/chat` and `/api/assistant/chat`)

### `POST /api/v1/assistant/chat` (and `/api/assistant/chat`)
* **Auth**: Public / Optional Bearer Token
* **Request**:
  ```json
  {
    "message": "Show wireless ANC earbuds under ₹2000",
    "catalogContext": [...]
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "reply": "Here are top-rated wireless earbuds with Active Noise Cancellation under ₹2000...",
    "recommendedProductIds": ["prod-soundcore-earbuds", "prod-noise-buds-anc"],
    "suggestions": ["Compare with boAt", "Show earbuds under ₹1000"]
  }
  ```
