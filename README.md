# BuyZo Marketplace — Production Backend & E-Commerce Platform

BuyZo is a high-velocity mobile-first multi-vendor shopping marketplace built with an intelligent Gemini-powered AI Assistant, full catalog search & filtering, persistent shopping cart, multi-address management, simulated multi-gateway checkout (UPI / Card / NetBanking / COD), real-time order tracking, merchant seller management, and super admin governance.

---

## 🛠 Technology Stack

### Backend
* **Runtime**: Node.js 20+ / TypeScript 5.8
* **Framework**: Express 4.21
* **AI Engine**: Google Gemini 3.7 Flash (`@google/genai`) with live catalog grounding and regex fallback rule engine
* **Database & Persistence**: Transactional file-backed JSON document store with in-memory indexes, atomic writes, and seed initializer
* **Security & Auth**: Stateless JWT Bearer tokens (HMAC-SHA256), native `crypto.scrypt` password hashing, timing-safe equality, RBAC role guard (`customer`, `seller`, `admin`), object-level access verification, in-memory IP rate limiting, sensitive data redaction

### Frontend
* **Core**: React 19, Vite 6, TypeScript
* **Styling & UI**: TailwindCSS 4, Motion, Lucide Icons, Canvas Confetti
* **Client Architecture**: Dedicated typed API client (`src/services/api.ts`) with background persistence sync and fallback resilience

---

## 📂 Project Architecture & Structure

```text
/docs/                      # Persistent AI Context & Architecture System
├── CONTEXT.md              # Project overview & memory
├── REQUIREMENTS.md         # Requirements matrix (REQ-001 to REQ-012)
├── ARCHITECTURE.md         # Layered architectural design & data flow
├── API_CONTRACT.md         # REST API schema documentation
├── DATABASE.md             # Entity schemas, types, and indexes
├── DECISIONS.md            # Architecture decision log (DEC-001 to DEC-006)
├── BUSINESS_RULES.md       # Server-enforced business logic (BR-001 to BR-009)
├── SECURITY.md             # Security specifications & RBAC
├── ERROR_HANDLING.md       # Centralized error formats & codes
├── VALIDATION.md           # Declarative request validation rules
├── TESTING.md              # Testing strategy & test suites
├── DEPLOYMENT.md           # Environment variables & run guide
├── CHANGELOG.md            # Release & change tracking
└── TODO.md                 # Implementation task tracker

server/                     # Production-Grade Layered Backend
├── config/                 # Environment, transactional DB, and structured logger
│   ├── env.ts
│   ├── database.ts
│   └── logger.ts
├── constants/              # HTTP codes, machine error codes, and roles
│   ├── httpCodes.ts
│   ├── errorCodes.ts
│   └── roles.ts
├── middlewares/            # Auth, RBAC guard, rate limiting, logging, validation, error handler
│   ├── auth.ts
│   ├── roleGuard.ts
│   ├── validator.ts
│   ├── rateLimiter.ts
│   ├── requestLogger.ts
│   └── errorHandler.ts
├── models/                 # Database schema interfaces
├── repositories/           # Repository pattern data access layer (User, Product, Order, Cart, Address, Category)
├── services/               # Core business logic & transaction orchestration
├── controllers/            # Request parsing and HTTP response mapping
├── routes/                 # Versioned REST endpoints (/api/v1/)
├── utils/                  # Cryptography, response envelopes, error classes, seed data
├── tests/                  # Unit and API integration test suites
│   ├── unit/
│   ├── integration/
│   └── runner.ts
└── app.ts                  # Express application bootstrap
```

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v20 or newer)
* npm (v10 or newer)

### 2. Installation
```powershell
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```ini
PORT=3000
NODE_ENV=development
JWT_SECRET=buyzo-production-secret-token-key-2026
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running Locally in Development Mode
```powershell
npm run dev
```
Starts the full-stack server on `http://localhost:3000`.

### 5. Running Automated Test Suites
```powershell
npm.cmd exec tsx server/tests/runner.ts
```

### 6. Production Build & Start
```powershell
npm run build
npm start
```

---

## 📡 API Endpoints Overview (`/api/v1`)

| Module | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | Public | System status and uptime diagnostics |
| **Auth** | `POST` | `/api/v1/auth/signup` | Public | Register customer or merchant seller |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Email + Password authentication |
| **Auth** | `POST` | `/api/v1/auth/send-otp` | Public | Send mobile/email OTP |
| **Auth** | `POST` | `/api/v1/auth/verify-otp` | Public | Verify OTP and issue JWT |
| **Auth** | `POST` | `/api/v1/auth/quick-demo` | Public | 1-Click demo role token generator |
| **Auth** | `GET` | `/api/v1/auth/me` | Bearer | Fetch authenticated user profile |
| **Products** | `GET` | `/api/v1/products` | Public | Query catalog (search, filter, sort, paginate) |
| **Products** | `GET` | `/api/v1/products/:id` | Public | Get product details & verified reviews |
| **Products** | `GET` | `/api/v1/products/categories` | Public | Taxonomy taxonomy & item counts |
| **Cart** | `GET` | `/api/v1/cart` | Bearer | Get customer's active shopping bag |
| **Cart** | `POST` | `/api/v1/cart/items` | Bearer | Add item with stock check |
| **Cart** | `PUT` | `/api/v1/cart/items/:id` | Bearer | Update item quantity |
| **Cart** | `DELETE`| `/api/v1/cart/items/:id` | Bearer | Remove item from cart |
| **Address** | `GET` | `/api/v1/addresses` | Bearer | List saved delivery addresses |
| **Address** | `POST`| `/api/v1/addresses` | Bearer | Add new shipping address |
| **Orders** | `GET` | `/api/v1/orders` | Bearer | Get customer's order history |
| **Orders** | `POST`| `/api/v1/orders` | Bearer | Place order with atomic stock lock |
| **Orders** | `POST`| `/api/v1/orders/:id/cancel` | Bearer | Cancel order & restore inventory |
| **Orders** | `POST`| `/api/v1/orders/:id/return` | Bearer | Submit return dispute request |
| **Payments**| `POST`| `/api/v1/payments/process` | Bearer | Process UPI/Card/NetBanking payment |
| **Seller** | `GET` | `/api/v1/seller/products` | Seller/Admin | Get seller's catalog items |
| **Seller** | `POST`| `/api/v1/seller/products` | Seller/Admin | Add new product to marketplace |
| **Seller** | `PUT` | `/api/v1/seller/products/:id/stock` | Seller/Admin | Update inventory stock count |
| **Seller** | `GET` | `/api/v1/seller/orders` | Seller/Admin | View orders assigned to merchant |
| **Seller** | `PUT` | `/api/v1/seller/orders/:id/status` | Seller/Admin | Advance shipment status |
| **Seller** | `GET` | `/api/v1/seller/analytics` | Seller/Admin | View GMV and store metrics |
| **Admin** | `GET` | `/api/v1/admin/kpis` | Admin | Super Admin platform GMV & metrics |
| **Admin** | `GET` | `/api/v1/admin/returns` | Admin | Review pending return disputes |
| **Admin** | `POST`| `/api/v1/admin/returns/:id/approve` | Admin | Approve return & initiate refund |
| **Admin** | `POST`| `/api/v1/admin/returns/:id/reject` | Admin | Reject dispute with policy reason |
| **Admin** | `GET` | `/api/v1/admin/sellers` | Admin | Review merchant GSTIN & status |
| **AI** | `POST` | `/api/v1/assistant/chat` | Public | Gemini 3.7 grounded shopping advisor |

For detailed API contracts and schemas, see [`/docs/API_CONTRACT.md`](./docs/API_CONTRACT.md).
