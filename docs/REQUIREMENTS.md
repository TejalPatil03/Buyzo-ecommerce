# BuyZo Marketplace — Backend Requirements

## Requirements Matrix

### REQ-001: User Authentication & Profile Management
* **ID**: REQ-001
* **Description**: Support Phone + OTP login/registration, Email + Password login/registration, and 1-Click role-switching for demo purposes. Allow users to fetch current authenticated profile (`/me`).
* **Source**: PRD & Frontend `AuthScreen.tsx` / `ProfileScreen.tsx`
* **Priority**: High
* **Backend Impact**: User schema, AuthService, password hashing, JWT generation & verification, AuthController, AuthRoutes.
* **Status**: In Progress

### REQ-002: Product Catalog & Category Taxonomy
* **ID**: REQ-002
* **Description**: Provide catalog query API supporting category filtering, keyword search, brand filtering, price range, sorting (rating, price, newest), in-stock filtering, and pagination. Provide individual product detail API with specifications and verified reviews.
* **Source**: PRD & Frontend `HomeScreen.tsx` / `SearchResultsScreen.tsx` / `ProductDetailScreen.tsx`
* **Priority**: High
* **Backend Impact**: Product & Category schemas, ProductRepository, ProductService, ProductController, caching/indexing.
* **Status**: In Progress

### REQ-003: AI Shopping Assistant with Catalog Grounding
* **ID**: REQ-003
* **Description**: Process user shopping queries using Gemini 3.7 Flash, grounding recommendations on real catalog items, returning markdown advice, recommended product IDs, and follow-up prompt chips. Include smart fallback rule engine when API key is unavailable.
* **Source**: PRD & Frontend `AIAssistantScreen.tsx` / `server.ts`
* **Priority**: High
* **Backend Impact**: AssistantService, `@google/genai` integration, AssistantController, validation and rate limiting.
* **Status**: In Progress

### REQ-004: Cart & Persistent Bag Management
* **ID**: REQ-004
* **Description**: Allow authenticated users to add items, update quantities, remove items, select color/size variants, and clear cart. Verify stock availability during cart operations.
* **Source**: PRD & Frontend `CartScreen.tsx`
* **Priority**: High
* **Backend Impact**: Cart schema/repository, CartService, CartController.
* **Status**: In Progress

### REQ-005: Delivery Addresses Management
* **ID**: REQ-005
* **Description**: Allow customers to create, retrieve, update, delete, and set default delivery addresses (Home, Work, Other) with PIN code and mobile number validation.
* **Source**: PRD & Frontend `CheckoutScreen.tsx` / `ProfileScreen.tsx`
* **Priority**: Medium
* **Backend Impact**: Address schema/repository, AddressService, AddressController.
* **Status**: In Progress

### REQ-006: Order Lifecycle & Stock Allocation
* **ID**: REQ-006
* **Description**: Place orders with atomic stock validation/decrement, generate unique order numbers (`BZ-YYYY-XXXXX`), populate tracking milestones (`Placed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`), calculate delivery fees and discounts server-side.
* **Source**: PRD & Frontend `CheckoutScreen.tsx` / `OrdersScreen.tsx` / `OrderDetailScreen.tsx`
* **Priority**: High
* **Backend Impact**: Order schema/repository, OrderService, stock locking, OrderController.
* **Status**: In Progress

### REQ-007: Payment Transaction Processing
* **ID**: REQ-007
* **Description**: Support UPI (Google Pay, PhonePe, Paytm, QR, VPA), Credit/Debit Cards (3DS validation simulation), NetBanking, PayLater/EMI, and Cash on Delivery (with captcha verification). Generate transaction references and audit logs.
* **Source**: PRD & Frontend `PaymentScreen.tsx`
* **Priority**: High
* **Backend Impact**: PaymentTransaction schema, PaymentService, PaymentController.
* **Status**: In Progress

### REQ-008: Customer Order Cancellation & Returns
* **ID**: REQ-008
* **Description**: Allow customer to cancel order before dispatch (status `Placed` / `Processing`) with inventory restoration. Allow return request submission within eligible window with reason logging.
* **Source**: PRD & Frontend `OrderDetailScreen.tsx`
* **Priority**: High
* **Backend Impact**: OrderService lifecycle state machine, cancellation and return handlers.
* **Status**: In Progress

### REQ-009: Seller Merchant Management & Inventory Control
* **ID**: REQ-009
* **Description**: Sellers can view their own catalog items, add new products with specifications, update real-time stock levels, view customer orders containing their goods, update fulfillment status (`Processing`, `Shipped`), and view merchant GMV analytics.
* **Source**: PRD & Frontend `SellerDashboardScreen.tsx`
* **Priority**: High
* **Backend Impact**: SellerService, SellerController, seller-specific repository queries, role enforcement.
* **Status**: In Progress

### REQ-010: Super Admin Platform Governance & Dispute Resolution
* **ID**: REQ-010
* **Description**: Admins can view platform KPIs (total GMV, merchant count, dispute count), review return dispute requests, approve (initiates refund) or reject (records non-compliance reason) returns, and approve/suspend merchant seller accounts.
* **Source**: PRD & Frontend `AdminDashboardScreen.tsx`
* **Priority**: High
* **Backend Impact**: AdminService, AdminController, platform metrics aggregator, admin role enforcement.
* **Status**: In Progress

### REQ-011: Security, Rate Limiting & Input Validation
* **ID**: REQ-011
* **Description**: Protect endpoints with rate limiting, input sanitization, JWT authorization headers, role verification, and robust exception handling without leaking stack traces.
* **Source**: Architecture & Security Best Practices
* **Priority**: High
* **Backend Impact**: Middlewares, Validators, ErrorHandler.
* **Status**: In Progress

### REQ-012: System Health & Diagnostics
* **ID**: REQ-012
* **Description**: Provide `/api/health` and `/api/v1/health` with service status, database health, uptime, and memory statistics.
* **Source**: Production Architecture Standard
* **Priority**: Medium
* **Backend Impact**: HealthController, HealthRoutes.
* **Status**: In Progress
