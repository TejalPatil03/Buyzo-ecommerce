# BuyZo Marketplace — Persistent AI Context

## Project Overview
* **Project Name**: BuyZo
* **Project Purpose**: High-velocity mobile-first multi-vendor shopping marketplace with BuyZo AI Assistant, rich catalog search, order tracking, seller management, and admin governance in the Indian e-commerce ecosystem (INR pricing, UPI/Cards/NetBanking/COD payments, PIN code logistics).
* **Target Users**:
  1. **Shoppers / Customers**: Browse catalog, ask AI assistant for recommendations, add to cart, manage addresses, checkout with multiple payment methods, track shipments with multi-stage events, request cancellations and returns.
  2. **Seller Partners**: Manage catalog listings, update real-time stock levels, view merchant-specific orders, advance fulfillment status, and track sales revenue/GMV.
  3. **Super Administrators**: Platform governance, review and approve/reject return & refund disputes, inspect GSTIN compliance, approve or suspend seller stores, monitor platform KPIs.

## Technology Stack
* **Runtime**: Node.js (v20+) / TypeScript (~5.8)
* **Backend Framework**: Express 4.x
* **AI Engine**: Google Gemini 3.7 Flash (`@google/genai` SDK) with catalog grounding & intent analysis.
* **Database & Persistence**: Transactional file-backed document store with schema enforcement, atomic write locks, automated indexing, and seed initialization from initial catalog. Repository pattern ensures seamless plug-and-play migration to MongoDB or PostgreSQL.
* **Frontend**: React 19, Vite 6, TailwindCSS 4, Motion, Lucide Icons, Canvas Confetti.

## Backend Architecture
* **Pattern**: Layered Clean Architecture
* **Flow**: `HTTP Client` → `Router` → `Middlewares (Auth, RoleGuard, Validator, RateLimiter)` → `Controller` → `Service (Business Rules & Transactions)` → `Repository (Data Access & Queries)` → `Persistence Store`.
* **API Version**: `/api/v1/` with backward compatibility for prototype routes (`/api/assistant/chat`, `/api/health`).

## Authentication & Authorization Strategy
* **Auth Mechanisms**:
  1. Phone + 6-digit OTP verification (Instant SMS simulation).
  2. Email + Password (hashed with Node.js crypto scrypt).
  3. Instant 1-Click Role-based Fast Switch for demo & testing.
* **Tokens**: Stateless signed JWT Bearer tokens with payload `{ userId, role, email, iat, exp }`.
* **Authorization**: RBAC Middleware (`requireRole('customer' | 'seller' | 'admin')`) + Object-level ownership validation on resources (e.g. orders, addresses, seller listings).

## Current Implementation Phase
* **Phase**: Backend Development & Frontend API Integration (Phase 1).
* **Constraints**: Preserves all existing frontend UI flows, contracts, component props, and AI assistant capabilities while delivering real persistence, error handling, validation, and security.
