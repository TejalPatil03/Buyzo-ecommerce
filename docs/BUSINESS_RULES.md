# BuyZo Marketplace — Business Rules

### BR-001: Pricing & Free Shipping Threshold
* If an order's subtotal is greater than ₹500, delivery fee is ₹0 (Free Shipping).
* If an order's subtotal is ₹500 or below, a flat standard delivery fee of ₹49 is applied.
* All currency calculations are rounded to whole numbers in Indian Rupees (INR).

### BR-002: Discount Percentage Calculation
* Discount percentage is derived strictly from `originalPrice` and `price`:
  $$\text{discountPercent} = \text{round}\left(\frac{\text{originalPrice} - \text{price}}{\text{originalPrice}} \times 100\right)$$
* `price` must never exceed `originalPrice`.

### BR-003: Stock Reservation & Inventory Depletion
* When an order is placed, stock for each ordered item is atomically validated: `stockCount >= quantity`.
* If sufficient stock exists, `stockCount` is decremented by `quantity`. If `stockCount === 0`, `inStock` becomes `false`.
* If any item in the order has insufficient stock, the entire order placement fails with `INSUFFICIENT_STOCK`.

### BR-004: Order Cancellation Policy
* A customer may cancel an order ONLY if the status is `Placed` or `Processing`.
* Once an order transitions to `Shipped`, `Out for Delivery`, or `Delivered`, direct customer cancellation is forbidden.
* Upon cancellation, stock is automatically restored to the product inventory, and a tracking milestone `Order Cancelled` is appended.

### BR-005: Returns & Refunds Eligibility
* A return request may only be lodged on orders with status `Delivered`.
* The return request must be filed within the 10-day window (`returnEligibleUntil`).
* When a customer requests a return, `returnStatus` transitions to `Requested`.
* Super Admin review is required to approve or reject the return dispute.

### BR-006: Admin Return Resolution
* When an Admin approves a return dispute (`POST /api/v1/admin/returns/:orderId/approve`), `returnStatus` transitions to `Approved & Refunded`, and an audit tracking milestone `Return Approved & Refund Credited` is logged.
* When an Admin rejects a return (`POST /api/v1/admin/returns/:orderId/reject`), a non-compliance reason must be provided, and `returnStatus` is updated to `Rejected - Policy Non-Compliant`.

### BR-007: Seller Merchant Permissions
* A seller can only update stock or metadata for products assigned to their `seller.id`.
* A seller can only advance fulfillment status (`Processing` → `Shipped`) for orders containing their products.
* A seller cannot approve refunds or modify other sellers' goods.

### BR-008: Default Address Guarantee
* A customer can have multiple saved addresses.
* Exactly one address must be flagged as `isDefault: true`.
* When a customer creates or updates an address with `isDefault: true`, all other addresses for that customer have `isDefault` set to `false`.

### BR-009: PIN Code & Phone Number Validation
* All shipping addresses require a valid 6-digit Indian Postal PIN code (e.g. `400076`).
* All user accounts and addresses require a valid 10-digit Indian Mobile phone number.
