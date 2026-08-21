# BuyZo Marketplace — Security Specification

## 1. Authentication & Token Management
* **JWT Signature**: HMAC-SHA256 with server-side `JWT_SECRET`. Tokens expire in 7 days by default.
* **Token Transport**: Standard HTTP `Authorization: Bearer <token>` header.
* **Sensitive Field Stripping**: Password hashes and salts are stripped before serializing user objects to client responses.

## 2. Password Security
* **Algorithm**: Native Node.js `crypto.scryptSync` with 16-byte cryptographically random salt and 64-byte key length.
* **Timing-Safe Comparison**: `crypto.timingSafeEqual` used for constant-time hash verification to eliminate timing side-channel attacks.

## 3. Role-Based Access Control (RBAC)
* Three permission levels:
  * `customer`: Access to personal profile, personal addresses, personal cart, personal orders, placing orders, requesting returns.
  * `seller`: Access to seller dashboard, own catalog inventory updates, adding new products, updating fulfillment status of assigned orders.
  * `admin`: Full platform governance, platform KPIs, merchant approval/suspension, dispute and return arbitration.
* Server-side route middleware `roleGuard('seller', 'admin')` verifies role directly from decoded JWT token.

## 4. Object-Level Access Control (IDOR Prevention)
* All resource operations verify resource ownership:
  * Users cannot view, modify, or cancel orders belonging to other users.
  * Users cannot access or delete addresses belonging to other users.
  * Sellers cannot edit products or modify orders belonging to competing sellers.

## 5. Rate Limiting & DoS Protection
* Global Rate Limiter: 100 requests per minute per IP.
* Sensitive Endpoints (`/api/v1/auth/login`, `/api/v1/auth/send-otp`): 10 attempts per minute per IP.
* AI Assistant (`/api/v1/assistant/chat`): 20 requests per minute per IP to protect Gemini API quota.

## 6. Input Sanitization & Validation
* Strict schema validation rejects payloads with unexpected fields or invalid types.
* Protection against prototype pollution, NoSQL injection patterns, and Cross-Site Scripting (XSS).

## 7. Security Headers & Error Masking
* Central error handler hides internal error stack traces in production (`NODE_ENV=production`), returning clean, sanitized error messages.
* Logs redact sensitive information (passwords, tokens, card numbers, CVVs).
