# BuyZo Marketplace — Testing Strategy

## Testing Philosophy
The testing strategy covers both isolated unit/service tests and end-to-end integration tests over the REST API endpoints.

## Test Categories

### 1. Unit Tests (`server/tests/unit/`)
* **Crypto & Security**:
  * Password hashing and verification timing accuracy.
  * JWT generation, tampering detection, and expiration handling.
* **Business Logic & Services**:
  * Product discount percentage derivation.
  * Free shipping calculation threshold (₹500).
  * Inventory stock validation and decrements.
  * Order cancellation rules (allowed on Placed/Processing, forbidden on Shipped).
  * Return window validation (10 days).

### 2. API Integration Tests (`server/tests/integration/`)
* **Auth Lifecycle**: Register customer → Login → Read profile `/me` → Access protected endpoints.
* **Product Catalog**: Fetch products with query filters, categories, and pagination.
* **Cart & Checkout**: Add item to cart → Set address → Place order → Verify inventory decreased.
* **Cancellation & Return**:
  * Customer cancels fresh order → Verify inventory restored.
  * Customer requests return on delivered order → Admin approves → Verify refund state.
* **Seller Partner Operations**:
  * Seller adds product → Seller updates stock → Public catalog reflects new stock.
* **Admin Governance**:
  * Admin fetches platform KPIs → Admin changes merchant status.

## Test Execution
Tests can be executed via tsx test runner script:
```powershell
npx tsx server/tests/runner.ts
```
