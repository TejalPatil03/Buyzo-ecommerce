import { ValidatorFn } from '../middlewares/validator';

export const validateProductCreate: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }
  if (!body.category || typeof body.category !== 'string') {
    errors.push('category is required');
  }
  if (body.price === undefined || typeof Number(body.price) !== 'number' || Number(body.price) <= 0) {
    errors.push('price must be a positive number');
  }
  if (body.stockCount !== undefined && (typeof Number(body.stockCount) !== 'number' || Number(body.stockCount) < 0)) {
    errors.push('stockCount must be a non-negative integer');
  }
  return { valid: errors.length === 0, errors };
};

export const validateStockUpdate: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (body.stockCount === undefined || typeof Number(body.stockCount) !== 'number' || Number(body.stockCount) < 0) {
    errors.push('stockCount must be a non-negative integer');
  }
  return { valid: errors.length === 0, errors };
};
