import { ValidatorFn } from '../middlewares/validator';

export const validateAddToCart: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.productId || typeof body.productId !== 'string') {
    errors.push('productId is required');
  }
  if (body.quantity !== undefined && (typeof Number(body.quantity) !== 'number' || Number(body.quantity) < 1)) {
    errors.push('quantity must be at least 1');
  }
  return { valid: errors.length === 0, errors };
};

export const validateUpdateCartItem: ValidatorFn = (body) => {
  const errors: string[] = [];
  const hasQuantity = body.quantity !== undefined && !isNaN(Number(body.quantity));
  const hasDelta = body.delta !== undefined && !isNaN(Number(body.delta));
  if (!hasQuantity && !hasDelta) {
    errors.push('either quantity (exact) or delta (increment/decrement) number is required');
  }
  return { valid: errors.length === 0, errors };
};
