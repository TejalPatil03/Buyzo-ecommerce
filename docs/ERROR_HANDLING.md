# BuyZo Marketplace — Error Handling Architecture

## Standard Error Response Structure
All error responses from the BuyZo API follow this exact JSON schema:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Product with ID prod-xyz does not exist",
    "details": []
  }
}
```

## Error Codes Catalog

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `BAD_REQUEST` | Malformed request body or missing required query parameter |
| 400 | `VALIDATION_ERROR` | Schema validation constraint violated |
| 400 | `INVALID_CREDENTIALS` | Incorrect password or invalid login identifier |
| 400 | `INVALID_OTP` | Provided OTP does not match or has expired |
| 400 | `INSUFFICIENT_STOCK` | Product inventory is inadequate for requested order quantity |
| 400 | `INVALID_ORDER_STATE` | Operation is not permissible for the current order lifecycle state |
| 401 | `UNAUTHORIZED` | Missing, expired, or invalid Bearer JWT token |
| 403 | `FORBIDDEN` | Insufficient role permissions or resource ownership failure |
| 404 | `NOT_FOUND` | Requested entity (product, order, address, seller) not found |
| 409 | `CONFLICT` | Resource collision (e.g. email or phone already registered) |
| 429 | `TOO_MANY_REQUESTS` | Rate limit threshold exceeded |
| 500 | `INTERNAL_SERVER_ERROR` | Unhandled server exception (stack trace redacted in production) |

## Custom `AppError` Class
All application-level exceptions inherit from `AppError`:
```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

## Central Error Handler Middleware
Located in `server/middlewares/errorHandler.ts`:
* Catches all synchronous and asynchronous errors forwarded via `next(err)`.
* Emits structured JSON logs with correlation IDs.
* Never leaks sensitive database connection strings, paths, or stack traces in non-development environments.
