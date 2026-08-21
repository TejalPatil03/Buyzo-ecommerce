# BuyZo Marketplace — System Architecture

## Architecture Overview

BuyZo uses a clean, layered, modular backend architecture designed for production-readiness, maintainability, type safety, and scalability.

```mermaid
graph TD
    Client[React 19 SPA Frontend / API Consumer]
    Vite[Vite Dev Server / Static Dist Engine]
    Express[Express.js Applet Core]
    
    subgraph Middleware Layer
        Logger[Request Logger & Correlation ID]
        RateLimit[Rate Limiter]
        AuthMid[Auth & JWT Verification]
        RoleMid[RBAC Role Guard]
        Validator[Schema Input Validator]
        ErrMid[Central Error Handler]
    end
    
    subgraph Routing Layer [/api/v1/]
        AuthRoutes[/api/v1/auth]
        ProductRoutes[/api/v1/products]
        CartRoutes[/api/v1/cart]
        OrderRoutes[/api/v1/orders]
        PaymentRoutes[/api/v1/payments]
        SellerRoutes[/api/v1/seller]
        AdminRoutes[/api/v1/admin]
        AssistantRoutes[/api/v1/assistant]
        HealthRoutes[/api/v1/health]
    end
    
    subgraph Controller Layer
        AuthCtrl[AuthController]
        ProdCtrl[ProductController]
        CartCtrl[CartController]
        OrderCtrl[OrderController]
        PayCtrl[PaymentController]
        SellerCtrl[SellerController]
        AdminCtrl[AdminController]
        AssistCtrl[AssistantController]
    end
    
    subgraph Service Layer - Business Logic
        AuthSvc[AuthService]
        ProdSvc[ProductService]
        CartSvc[CartService]
        OrderSvc[OrderService]
        PaySvc[PaymentService]
        SellerSvc[SellerService]
        AdminSvc[AdminService]
        AssistSvc[AssistantService]
    end
    
    subgraph External & AI Layer
        Gemini[Google Gemini 3.7 Flash API]
        RuleEngine[Fallback Smart Rule Engine]
    end
    
    subgraph Repository & Data Access Layer
        UserRepo[UserRepository]
        ProdRepo[ProductRepository]
        OrderRepo[OrderRepository]
        CartRepo[CartRepository]
        AddrRepo[AddressRepository]
    end
    
    subgraph Persistence Store
        DocDB[(Transactional JSON Document Store)]
    end

    Client --> Vite
    Client --> Express
    Express --> Logger --> RateLimit --> AuthMid --> RoleMid --> Validator
    Validator --> RoutingLayer
    
    AuthRoutes --> AuthCtrl --> AuthSvc --> UserRepo
    ProductRoutes --> ProdCtrl --> ProdSvc --> ProdRepo
    CartRoutes --> CartCtrl --> CartSvc --> CartRepo
    OrderRoutes --> OrderCtrl --> OrderSvc --> OrderRepo & ProdRepo
    PaymentRoutes --> PayCtrl --> PaySvc --> OrderRepo
    SellerRoutes --> SellerCtrl --> SellerSvc --> ProdRepo & OrderRepo
    AdminRoutes --> AdminCtrl --> AdminSvc --> OrderRepo & UserRepo
    AssistantRoutes --> AssistCtrl --> AssistSvc --> Gemini & RuleEngine & ProdRepo
    
    UserRepo & ProdRepo & OrderRepo & CartRepo & AddrRepo --> DocDB
    Express --> ErrMid
```

## Layer Responsibilities

### 1. Routes (`server/routes/`)
* Declares HTTP paths, HTTP verbs, and parameter shapes.
* Attaches authentication, authorization guards, and validation middlewares.
* Pure mapping without business logic.

### 2. Middlewares (`server/middlewares/`)
* `requestLogger`: Assigns correlation IDs and logs incoming HTTP method, path, status, and duration.
* `rateLimiter`: Protects against brute-force and DoS.
* `auth`: Decodes and validates JWT bearer tokens, attaches `req.user`.
* `roleGuard`: Enforces role-based permissions (`customer`, `seller`, `admin`).
* `validator`: Validates `req.body`, `req.query`, and `req.params`.
* `errorHandler`: Intercepts unhandled errors and normalizes into standard response envelope `{ success: false, error: ... }`.

### 3. Controllers (`server/controllers/`)
* Handles HTTP request unpacking and HTTP response packaging.
* Invokes appropriate Service methods.
* Returns HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).

### 4. Services (`server/services/`)
* Encapsulates all domain rules, calculations (discounts, delivery fees, order totals, returns eligibility).
* Manages atomic operations (inventory locking/decrements upon order placement, inventory restoration upon cancellation).
* Orchestrates multi-repository workflows.

### 5. Repositories (`server/repositories/`)
* Implements the Repository design pattern.
* Provides CRUD, filtering, pagination, search, sorting, and atomic mutations on entities.
* Decouples domain logic from persistence technology.

### 6. Persistence Store (`server/config/database.ts`)
* High-performance, atomic file-backed transactional JSON database with schema validation and memory caching.
* Automatically initializes with seed data from `mockData.ts` on fresh boots.
* Easily replaceable with MongoDB or PostgreSQL by implementing repository interfaces.
