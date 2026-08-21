import { ValidatorFn } from '../middlewares/validator';

export const validateSignup: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
    errors.push('fullName must be at least 2 characters long');
  }
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push('valid email is required');
  }
  if (!body.phone || typeof body.phone !== 'string' || body.phone.replace(/\D/g, '').length < 10) {
    errors.push('valid 10-digit phone number is required');
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 4) {
    errors.push('password must be at least 4 characters long');
  }
  if (body.role && !['customer', 'seller', 'admin'].includes(body.role)) {
    errors.push('role must be one of: customer, seller, admin');
  }
  if (body.role === 'seller') {
    if (!body.sellerStoreName || typeof body.sellerStoreName !== 'string') {
      errors.push('sellerStoreName is required for seller registration');
    }
  }

  return { valid: errors.length === 0, errors };
};

export const validateLogin: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.email || typeof body.email !== 'string') {
    errors.push('email is required');
  }
  if (!body.password || typeof body.password !== 'string') {
    errors.push('password is required');
  }
  return { valid: errors.length === 0, errors };
};

export const validateSendOtp: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.identifier && !body.phone && !body.email) {
    errors.push('phone or email identifier is required');
  }
  return { valid: errors.length === 0, errors };
};

export const validateVerifyOtp: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.otp || typeof body.otp !== 'string' || body.otp.length < 4) {
    errors.push('valid OTP code is required');
  }
  return { valid: errors.length === 0, errors };
};

export const validateQuickDemo: ValidatorFn = (body) => {
  const errors: string[] = [];
  if (!body.role || !['customer', 'seller', 'admin'].includes(body.role)) {
    errors.push('role must be one of: customer, seller, admin');
  }
  return { valid: errors.length === 0, errors };
};
