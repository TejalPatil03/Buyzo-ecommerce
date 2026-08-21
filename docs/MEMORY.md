# PROJECT MEMORY

## Current State
- Backend: **COMPLETE & HARDENED** — all modules implemented, security-hardened, tested, verified
- Frontend: **INTEGRATED** — `frontend/src/services/api.ts` wires React UI to `/api/v1/` endpoints
- Structure: **SEPARATED** — backend/, frontend/, shared/ folders within single monorepo
- Build: `npm run dev` starts correctly; `npm run build` produces dist bundle
- Tests: 100% pass — 13 tests (4 unit + 9 integration) via `npm test`
- Lint: `npm run lint` (`tsc --noEmit`) passes with 0 errors

## Folder Structure
```
Buyzo-ecommerce/           ← monorepo root
  backend/                 ← all server-side code
    server.ts              ← Express entry point (run with: tsx backend/server.ts)
    server/                ← layered backend modules
      app.ts               ← Express bootstrap, CORS, security headers
      config/              ← env, database (ACID JSON store), logger
      constants/           ← httpCodes, errorCodes, roles
      controllers/         ← Auth, Product, Cart, Address, Order, Payment, Seller, Admin, Assistant, Health
      middlewares/         ← auth (JWT), roleGuard (RBAC), validator, rateLimiter, requestLogger, errorHandler
      repositories/        ← User, Product, Category, Cart, Address, Order
      routes/v1/           ← versioned REST routes + backward-compat aliases
      services/            ← Auth, Product, Cart, Address, Order, Payment, Seller, Admin, Assistant
      tests/               ← unit/ (crypto, services) + integration/ (api)
      utils/               ← crypto, errors, response, seedData
      validators/          ← auth, product, cart, address, order
    data/
      buyzo_store.json     ← persistent ACID JSON database (auto-seeded on first boot)
  frontend/                ← all client-side code
    index.html             ← Vite SPA entry
    vite.config.ts         ← root=frontend/, @alias=monorepo root, outDir=../dist
    src/
      App.tsx              ← React root with API integration
      main.tsx             ← React DOM mount
      index.css            ← TailwindCSS styles
      types.ts             ← re-exports from ../../shared/types
      components/          ← all screen components (Home, Cart, Orders, Auth, etc.)
      data/mockData.ts     ← catalog seed source (used by backend seedData.ts)
      services/api.ts      ← typed fetch client for all /api/v1/ endpoints
  shared/                  ← code shared between frontend and backend
    types.ts               ← canonical TypeScript types (Product, Order, User, etc.)
  docs/                    ← project documentation
  package.json             ← single root package.json for entire monorepo
  tsconfig.json            ← covers frontend/src, backend, shared
  .env.example             ← environment variable template
```

## Completed
- `/docs` context system (15 files)
- Config: `backend/server/config/env.ts`, `database.ts`, `logger.ts`
- Constants: `httpCodes.ts`, `errorCodes.ts`, `roles.ts`
- Utilities: `crypto.ts` (scrypt + HMAC-SHA256 JWT), `errors.ts`, `response.ts`, `seedData.ts`
- Middlewares: `requestLogger`, `rateLimiter`, `auth` (JWT), `roleGuard` (RBAC), `validator`, `errorHandler`
- CORS + security headers inline in `backend/server/app.ts`
- Validators: auth, product, cart (quantity OR delta), address, order
- Repositories: User, Product, Category, Cart, Address, Order
- Services: Auth, Product, Cart, Address, Order, Payment, Seller, Admin, Assistant (Gemini + fallback)
- Controllers: Auth, Product, Cart, Address, Order, Payment, Seller, Admin, Assistant, Health
- Routes: all `/api/v1/` versioned + backward-compat `/api/health` + `/api/assistant/chat`
- Tests: unit/crypto, unit/services, integration/api — all passing
- Frontend/backend folder separation with shared/types.ts

## In Progress
- Nothing — backend complete, structure separated

## Important Decisions
- **DEC-001**: JSON file store, zero external DB dependency, ACID-safe via atomic temp+rename
- **DEC-002**: Native `crypto.scrypt` (no bcrypt, no native compilation)
- **DEC-003**: HMAC-SHA256 JWT (no jsonwebtoken dep)
- **DEC-004**: Gemini 3.7 Flash + catalog-grounded rule engine fallback when no API key
- **DEC-005**: Versioned API at `/api/v1/` with backward-compat aliases
- **DEC-006**: Three roles: `customer`, `seller`, `admin` — RBAC via middleware
- **DEC-007**: CORS and security headers inline in app.ts — no cors/helmet packages
- **DEC-008**: Monorepo with backend/, frontend/, shared/ — single package.json + tsconfig.json at root

## Important Constraints
- Run all commands from **monorepo root** — `process.cwd()` must be root for DB_PATH to resolve
- No external database — data in `backend/data/buyzo_store.json`, auto-seeded on first boot
- Gemini AI works with or without API key (rule engine fallback)
- Demo credentials: all seed users use password `buyzo@2026`
- Seed users: `user-shopper-tejal` (customer), `user-seller-priya` (seller), `user-admin-vikram` (admin)
- Quick demo login: `POST /api/v1/auth/quick-demo` with `{ "role": "customer"|"seller"|"admin" }`

## Known Issues
- Test orders accumulate in `backend/data/buyzo_store.json` on repeated test runs (benign)

## Next Actions
- None — all known requirements implemented, structure separated, all tests passing
- To migrate DB: swap repositories to MongoDB/PostgreSQL drivers (repository pattern is DB-agnostic)
- To deploy: set `NODE_ENV=production`, `APP_URL`, `JWT_SECRET`, optional `GEMINI_API_KEY`

## Key Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Express + Vite HMR) |
| `npm test` | Run full test suite (unit + integration) |
| `npm run lint` | TypeScript type-check (0 errors) |
| `npm run build` | Production build (frontend dist + server bundle) |
| `npm start` | Run production build |

## Important Files
| File | Purpose |
|------|---------|
| `backend/server.ts` | Express entry point |
| `backend/server/app.ts` | App bootstrap, CORS, security headers |
| `backend/server/config/database.ts` | ACID JSON document store |
| `backend/server/config/env.ts` | Typed env config, DB_PATH default |
| `backend/server/middlewares/auth.ts` | JWT Bearer auth |
| `backend/server/middlewares/roleGuard.ts` | RBAC role enforcement |
| `backend/server/services/AssistantService.ts` | Gemini AI + rule engine |
| `backend/server/services/OrderService.ts` | Order lifecycle, atomic stock |
| `backend/server/utils/crypto.ts` | Scrypt hashing, HMAC-SHA256 JWT |
| `backend/server/utils/seedData.ts` | Initial seed (reads from frontend/src/data/mockData) |
| `backend/server/tests/runner.ts` | Test entry point |
| `backend/data/buyzo_store.json` | Live database file |
| `frontend/src/services/api.ts` | Typed frontend API client |
| `frontend/src/data/mockData.ts` | Catalog seed source |
| `shared/types.ts` | Canonical shared TypeScript types |
| `.env.example` | Env variable template |
| `docs/API_CONTRACT.md` | Full REST API documentation |
