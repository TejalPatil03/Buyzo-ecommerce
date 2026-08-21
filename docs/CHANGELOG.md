# BuyZo Marketplace — Changelog

## [2026-08-21] - Production Backend Architecture Initialization

### Added
* Established persistent AI Context System in `/docs` (`CONTEXT.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `API_CONTRACT.md`, `DATABASE.md`, `DECISIONS.md`, `BUSINESS_RULES.md`, `SECURITY.md`, `ERROR_HANDLING.md`, `VALIDATION.md`, `TESTING.md`, `DEPLOYMENT.md`, `CHANGELOG.md`, `TODO.md`).
* Layered modular backend architecture under `server/`:
  * `config/`: Environment configuration, ACID file-backed transactional document database engine, structured logger.
  * `constants/`: HTTP status codes, machine error codes, RBAC role definitions.
  * `utils/`: Crypto helpers (scrypt password hashing, timing-safe equality, JWT sign/verify), standard response builders, custom AppError classes, initial mock data seeder.
  * `middlewares/`: Request logger, rate limiter, JWT authentication, role guards (`customer`, `seller`, `admin`), declarative request validator, centralized error handler.
  * `models/` & `repositories/`: User, Product, Category, Order, Cart, Address, and Payment data access layers with indexed lookups and atomic mutations.
  * `services/`: AuthService, ProductService, CartService, AddressService, OrderService, PaymentService, SellerService, AdminService, and AssistantService.
  * `controllers/`: AuthController, ProductController, CartController, AddressController, OrderController, PaymentController, SellerController, AdminController, AssistantController, HealthController.
  * `routes/`: Versioned REST API routes under `/api/v1/` and prototype backward compatibility.
* Automated Unit & Integration test runner.
* Frontend typed API Client service (`src/services/api.ts`) connecting React UI components seamlessly to the live backend.

## [2026-08-21] - Production-Ready Hardening

### Fixed
* `errorHandler` — 4xx `AppError` responses (403, 401, 404, etc.) now log as `warn` without stack traces. Stack traces only appear on unexpected 5xx errors in dev mode, never in production.
* `cartValidators` — `validateUpdateCartItem` now accepts either `quantity` (exact set) or `delta` (increment/decrement), fixing cart update calls that only sent `delta`.

### Added
* **CORS middleware** (`server/app.ts`) — inline, no external dependency. Handles `OPTIONS` preflight with `204`, sets `Access-Control-Allow-Origin` (allowlist in production, open in dev), `Allow-Methods`, `Allow-Headers`, `Expose-Headers`, `Max-Age`.
* **Security headers** (`server/app.ts`) — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, removes `X-Powered-By`.

### Verified
* All 9 integration tests pass (health, products, categories, auth, cart, role guard, admin KPI, AI assistant).
* All 4 unit tests pass (password hashing, JWT sign/verify, tamper detection, service domain logic).
* `data/buyzo_store.json` schema integrity confirmed: 4 users, 17 products, 6 categories, 2 addresses, orders, carts, payments — all correct.
* `.env.example` complete and aligned with `server/config/env.ts`.
* Address CRUD routes (GET `/`, GET `/:id`, POST `/`, PUT `/:id`, DELETE `/:id`) confirmed fully wired.
