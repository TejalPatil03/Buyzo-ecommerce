import { ValidatorFn } from '../middlewares/validator';

export const validateCreateOrder: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    errors.push('items array cannot be empty');
  }
  if (!body.deliveryAddress || typeof body.deliveryAddress !== 'object') {
    errors.push('deliveryAddress object is required');
  }
  if (!body.paymentMethod || typeof body.paymentMethod !== 'string') {
    errors.push('paymentMethod is required');
  }
  return { valid: errors.length === 0, errors };
};

export const validateCancelOrder: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (body.reason && typeof body.reason !== 'string') {
    errors.push('reason must be a string');
  }
  return { valid: errors.length === 0, errors };
};

export const validateReturnOrder: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.reason || typeof body.reason !== 'string' || body.reason.trim().length < 3) {
    errors.push('detailed return reason is required (min 3 chars)');
  }
  return { valid: errors.length === 0, errors };
};
