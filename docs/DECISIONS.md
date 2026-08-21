# BuyZo Marketplace — Architecture Decision Log

### DEC-001: Layered Clean Architecture & Repository Pattern
* **Decision**: Adopt a strict layered architecture (`Routes` → `Middlewares` → `Controllers` → `Services` → `Repositories` → `Data Store`).
* **Why**: Separates HTTP transport from business logic, ensures isolation of domain rules (pricing, stock decrement, cancellation criteria), and allows zero-friction testability.
* **Alternatives considered**: Monolithic route handlers; Active Record pattern.
* **Impact**: Higher code maintainability and testability.
* **Date**: 2026-08-21

### DEC-002: Stateless JWT Authentication with Scrypt Password Hashing
* **Decision**: Implement stateless JWT Bearer tokens signed via HMAC-SHA256 and store passwords hashed with Node.js built-in `crypto.scryptSync` with random per-user salt.
* **Why**: Zero external dependency overhead, tamper-proof, high security, horizontally scalable across server instances.
* **Alternatives considered**: Session cookies (requires centralized redis session store); Plain bcrypt (external binary build dependencies).
* **Impact**: Highly secure, fast, and native to Node.js.
* **Date**: 2026-08-21

### DEC-003: Transactional Document Store with Auto-Seeding
* **Decision**: Implement a transactional, file-backed JSON document store with in-memory indexes, atomic writes (`fs.promises.writeFile` with rename temp atomic swap), and seed initialization from initial catalog `mockData.ts`.
* **Why**: Provides zero-configuration local persistence, preserves demo data out-of-the-box, avoids external database engine prerequisites, while the Repository interfaces allow instant drop-in migration to PostgreSQL/MongoDB.
* **Alternatives considered**: In-memory only (lost on restart); Heavy local PostgreSQL/Docker (complex setup for developers).
* **Impact**: Instant plug-and-play developer experience with persistent updates.
* **Date**: 2026-08-21

### DEC-004: Role-Based Authorization with Object-Level Ownership Verification
* **Decision**: Differentiate `customer`, `seller`, and `admin` roles at route level (`roleGuard`), combined with service-layer object ownership checks (e.g. users cannot cancel other users' orders; sellers can only update their own products/orders).
* **Why**: Prevents Horizontal and Vertical Privilege Escalation (IDOR attacks).
* **Alternatives considered**: Frontend-only role checks.
* **Impact**: Solid enterprise-grade security posture.
* **Date**: 2026-08-21

### DEC-005: AI Assistant Grounding & Dual-Engine Fallback
* **Decision**: Ground Gemini 3.7 Flash queries with full live catalog snapshots. If `GEMINI_API_KEY` is not present or API quota is exceeded, automatically invoke a smart regex/fuzzy rule-based recommendation engine.
* **Why**: Guarantees that the shopping assistant always provides relevant, functioning product links without breaking user experience.
* **Alternatives considered**: Hard error when API key missing.
* **Impact**: 100% uptime for AI shopping assistant interface.
* **Date**: 2026-08-21

### DEC-006: Server-Enforced Pricing, Stock Locking & Order Calculations
* **Decision**: Calculate item prices, discount percentages, delivery fee rules (₹0 for orders > ₹500, else ₹49), and inventory decrement exclusively on the server during order placement.
* **Why**: Clients must never be trusted with price totals, discount calculations, or direct inventory mutations.
* **Alternatives considered**: Trusting client-computed cart totals.
* **Impact**: Eliminates cart tampering vulnerabilities and race conditions on limited inventory.
* **Date**: 2026-08-21
