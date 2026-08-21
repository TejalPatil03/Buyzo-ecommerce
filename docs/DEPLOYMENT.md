# BuyZo Marketplace — Deployment & Environment Guide

## Environment Variables Configuration

Create a `.env` file in the root directory based on `.env.example`:

```ini
# Application Port (Default: 3000)
PORT=3000

# Node Environment ('development' | 'production' | 'test')
NODE_ENV=development

# JWT Secret Key for Signing Authentication Tokens
JWT_SECRET=buyzo-production-secret-token-key-2026

# JWT Expiration Duration (e.g. '7d', '24h')
JWT_EXPIRES_IN=7d

# Google Gemini API Key for AI Shopping Assistant
GEMINI_API_KEY=your_gemini_api_key_here

# App Base URL
APP_URL=http://localhost:3000

# Database Storage Directory
DB_PATH=./data/store.json
```

## Running the Application Locally

### 1. Install Dependencies
```powershell
npm install
```

### 2. Run in Development Mode (with Live Reloading & Vite Frontend)
```powershell
npm run dev
```
Starts Express server on `http://localhost:3000` with embedded Vite middleware and API endpoints under `/api/v1/`.

### 3. Type Checking & Verification
```powershell
npm run lint
```

### 4. Build for Production
```powershell
npm run build
```
Generates the optimized frontend bundle in `dist/` and bundles `server.ts` to `dist/server.cjs`.

### 5. Start Production Server
```powershell
npm start
```

## Health Checks
* Endpoint: `GET /api/health` or `GET /api/v1/health`
* Response: `{ "status": "ok", "app": "BuyZo API", "uptime": 124.5, "timestamp": "2026-08-21T11:30:00Z" }`
