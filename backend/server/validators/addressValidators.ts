import { ValidatorFn } from '../middlewares/validator';

export const validateAddress: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
    errors.push('fullName must be at least 2 characters');
  }
  if (!body.phone || typeof body.phone !== 'string' || body.phone.replace(/\D/g, '').length < 10) {
    errors.push('valid 10-digit phone is required');
  }
  if (!body.addressLine1 || typeof body.addressLine1 !== 'string' || body.addressLine1.trim().length < 3) {
    errors.push('addressLine1 must be at least 3 characters');
  }
  if (!body.city || typeof body.city !== 'string') {
    errors.push('city is required');
  }
  if (!body.state || typeof body.state !== 'string') {
    errors.push('state is required');
  }
  if (!body.pincode || typeof body.pincode !== 'string' || body.pincode.replace(/\D/g, '').length < 6) {
    errors.push('valid 6-digit postal pincode is required');
  }
  return { valid: errors.length === 0, errors };
};
