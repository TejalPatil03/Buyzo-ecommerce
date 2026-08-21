# BuyZo Marketplace — Request Validation Rules

## Validation Standards

All input from untrusted clients (`req.body`, `req.query`, `req.params`) is validated by declarative validator middlewares before reaching controllers.

### 1. User & Auth Validation
* **Email**: Valid RFC 5322 format, lowercase, max 255 chars.
* **Phone**: Exact 10 digits (digits only, e.g. `9820145678`), Indian mobile prefix 6-9.
* **Password**: Minimum 4 characters (for demo testing), up to 128 characters.
* **Full Name**: 2 to 100 characters, trimmed.
* **Role**: Must be one of `['customer', 'seller', 'admin']`.
* **GSTIN**: 15-character alphanumeric GSTIN regex: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`.

### 2. Product Validation
* **Name**: Required, 3-200 chars.
* **Category**: One of `['Fashion', 'Mobiles', 'Home', 'Beauty', 'Grocery', 'Electronics']`.
* **Price**: Number > 0.
* **OriginalPrice**: Number >= `price`.
* **StockCount**: Integer >= 0.
* **Image**: Valid URL format.

### 3. Address Validation
* **FullName**: Required, 2-100 chars.
* **Phone**: 10 digits.
* **AddressLine1**: Required, 5-200 chars.
* **City**: Required, 2-50 chars.
* **State**: Required, 2-50 chars.
* **Pincode**: Exact 6 numeric digits (e.g. `400076`).
* **Type**: One of `['Home', 'Work', 'Other']`.

### 4. Order & Payment Validation
* **Items**: Non-empty array of `{ productId: string, quantity: integer >= 1 }`.
* **PaymentMethod**: One of `['UPI', 'Card', 'NetBanking', 'COD', 'Wallet', 'PayLater']`.
* **Order Status Transition**: Restricted by state machine:
  * `Placed` → `Processing` → `Shipped` → `Out for Delivery` → `Delivered`
  * `Placed` / `Processing` → `Cancelled`
  * `Delivered` → `Returned` (via Return Approval)
