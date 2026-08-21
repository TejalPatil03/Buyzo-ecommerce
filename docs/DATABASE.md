# BuyZo Marketplace — Database Specification

## Entity Data Models

### 1. User (`users`)
| Field | Type | Required | Constraints / Notes |
|---|---|---|---|
| `id` | `string` (UUID) | Yes | Primary Key (`usr-xxx`) |
| `fullName` | `string` | Yes | 2-100 characters |
| `email` | `string` | Yes | Unique, Lowercase, Indexed |
| `phone` | `string` | Yes | Unique, 10-digit Indian Mobile, Indexed |
| `passwordHash` | `string` | Yes | Secure salted hash (Scrypt) |
| `role` | `enum` | Yes | `'customer' \| 'seller' \| 'admin'` |
| `avatarLetter` | `string` | Yes | Single uppercase character |
| `isVip` | `boolean` | Yes | Default: `false` |
| `sellerStoreName` | `string` | No | Required if role is `'seller'` |
| `gstin` | `string` | No | Format: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$` |
| `city` | `string` | No | User location |
| `createdAt` | `string` (ISO) | Yes | Timestamp |
| `updatedAt` | `string` (ISO) | Yes | Timestamp |
| `isDeleted` | `boolean` | Yes | Soft-delete flag (default: `false`) |

### 2. Product (`products`)
| Field | Type | Required | Constraints / Notes |
|---|---|---|---|
| `id` | `string` | Yes | Primary Key (`prod-xxx`) |
| `name` | `string` | Yes | Indexed for text search |
| `brand` | `string` | Yes | Indexed |
| `category` | `enum` | Yes | `'Fashion' \| 'Mobiles' \| 'Home' \| 'Beauty' \| 'Grocery' \| 'Electronics'` |
| `price` | `number` | Yes | In INR, >= 0 |
| `originalPrice` | `number` | Yes | In INR, >= price |
| `discountPercent` | `number` | No | Calculated `round(((orig - price)/orig)*100)` |
| `rating` | `number` | Yes | 1.0 to 5.0 |
| `ratingCount` | `number` | Yes | >= 0 |
| `image` | `string` (URL) | Yes | Primary image URL |
| `additionalImages` | `string[]` | No | Gallery images |
| `seller` | `SellerObject` | Yes | `{ id, name, rating, reviewsCount, isVerified, city }` |
| `inStock` | `boolean` | Yes | `stockCount > 0` |
| `stockCount` | `number` | Yes | Non-negative integer |
| `isBestSeller` | `boolean` | No | Flag |
| `isLimitedStock` | `boolean` | No | Flag |
| `deliveryTimeText` | `string` | Yes | e.g. "Free Delivery Tomorrow" |
| `description` | `string` | Yes | Long description |
| `specifications` | `Record<string, string>` | Yes | Key-value pairs |
| `reviews` | `Review[]` | Yes | Embedded list of reviews |
| `tags` | `string[]` | Yes | Search tags |
| `createdAt` | `string` (ISO) | Yes | Timestamp |
| `updatedAt` | `string` (ISO) | Yes | Timestamp |
| `isDeleted` | `boolean` | Yes | Soft-delete flag |

### 3. Category (`categories`)
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | `cat-xxx` |
| `name` | `string` | Yes | Unique |
| `slug` | `string` | Yes | URL-safe slug |
| `image` | `string` | Yes | Category thumbnail |
| `description` | `string` | No | Subtitle |
| `itemCount` | `number` | Yes | Dynamic/cached count |

### 4. Cart (`carts`)
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | `cart-usr-xxx` |
| `userId` | `string` | Yes | Foreign Key to User |
| `items` | `CartItem[]` | Yes | `[{ product: Product, quantity: number, selectedColor?, selectedSize? }]` |
| `updatedAt` | `string` (ISO) | Yes | Timestamp |

### 5. Address (`addresses`)
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | `addr-xxx` |
| `userId` | `string` | Yes | Foreign Key to User |
| `fullName` | `string` | Yes | Recipient name |
| `phone` | `string` | Yes | 10-digit mobile |
| `addressLine1` | `string` | Yes | House/Flat/Street |
| `addressLine2` | `string` | No | Landmark/Area |
| `city` | `string` | Yes | City |
| `state` | `string` | Yes | State |
| `pincode` | `string` | Yes | 6-digit Indian PIN Code |
| `isDefault` | `boolean` | Yes | One default per user |
| `type` | `enum` | Yes | `'Home' \| 'Work' \| 'Other'` |

### 6. Order (`orders`)
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | Primary Key (`ord-xxx`) |
| `orderNumber` | `string` | Yes | Unique identifier (`BZ-YYYY-XXXXX`) |
| `userId` | `string` | Yes | Foreign Key to User |
| `date` | `string` | Yes | e.g. "21 Aug 2026, 11:30 AM" |
| `status` | `enum` | Yes | `'Placed' \| 'Processing' \| 'Shipped' \| 'Out for Delivery' \| 'Delivered' \| 'Cancelled' \| 'Returned'` |
| `items` | `CartItem[]` | Yes | Frozen snapshot of items at purchase |
| `totalAmount` | `number` | Yes | Calculated server-side in INR |
| `discountAmount` | `number` | Yes | Total savings in INR |
| `shippingFee` | `number` | Yes | 0 if total > ₹500, else ₹49 |
| `deliveryAddress` | `Address` | Yes | Frozen delivery address snapshot |
| `paymentMethod` | `string` | Yes | e.g. "UPI (Google Pay)" |
| `paymentDetails` | `PaymentTransaction` | No | Linked transaction record |
| `trackingEvents` | `TrackingEvent[]` | Yes | Chronological delivery timeline milestones |
| `returnEligibleUntil` | `string` | Yes | Date string (10 days from delivery/order) |
| `returnStatus` | `enum` | Yes | `'None' \| 'Requested' \| 'Approved & Refunded' \| 'Rejected - Policy Non-Compliant'` |
| `createdAt` | `string` (ISO) | Yes | ISO Timestamp |
| `updatedAt` | `string` (ISO) | Yes | ISO Timestamp |

### 7. PaymentTransaction (`payments`)
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `string` | Yes | `tx-xxx` |
| `orderId` | `string` | Yes | Reference to Order |
| `userId` | `string` | Yes | User who paid |
| `amount` | `number` | Yes | Amount paid in INR |
| `method` | `enum` | Yes | `'UPI' \| 'Card' \| 'NetBanking' \| 'COD' \| 'Wallet' \| 'PayLater'` |
| `subMethod` | `string` | No | e.g. "Google Pay", "HDFC Bank" |
| `status` | `enum` | Yes | `'Success' \| 'Processing' \| 'Failed'` |
| `transactionRef` | `string` | Yes | `TXN-BZ-XXXXXXXX` |
| `bankRef` | `string` | No | `RRN-XXXXXXXXXXXX` |
| `upiVpa` | `string` | No | UPI Virtual Private Address |
| `cardLast4` | `string` | No | Last 4 digits of card |
| `bankName` | `string` | No | Bank name for netbanking |
| `timestamp` | `string` | Yes | Execution timestamp |

---

## Indexing Strategy
* `users.email`: Unique index for instant authentication lookups.
* `users.phone`: Unique index for OTP lookups.
* `products.category`: Index for fast category navigation.
* `products.name` & `products.tags`: Search index.
* `orders.userId`: Index for fast customer order history retrieval.
* `orders.status` & `orders.returnStatus`: Index for admin dispute views.

## Soft Deletion Strategy
* Deletions on products, users, and addresses set `isDeleted: true` and record `deletedAt: new Date().toISOString()`. Queries filter `{ isDeleted: false }` by default.
