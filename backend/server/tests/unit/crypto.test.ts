import { hashPassword, verifyPassword, generateToken, verifyToken } from '../../utils/crypto';

export async function runCryptoTests() {
  console.log('--- Running Crypto & Security Unit Tests ---');

  // 1. Password Hashing & Verification
  const rawPass = 'SecretPassword@123';
  const hashed = hashPassword(rawPass);

  if (!hashed.includes(':')) {
    throw new Error('Hashed password does not contain salt separator');
  }

  const isValid = verifyPassword(rawPass, hashed);
  if (!isValid) {
    throw new Error('Password verification failed for correct password');
  }

  const isInvalid = verifyPassword('WrongPassword', hashed);
  if (isInvalid) {
    throw new Error('Password verification succeeded for wrong password');
  }

  console.log('✓ Password hashing and verification passed');

  // 2. JWT Generation & Verification
  const token = generateToken({
    userId: 'usr-test-123',
    email: 'test@buyzo.in',
    role: 'customer',
  }, 3600);

  if (!token || token.split('.').length !== 3) {
    throw new Error('Invalid JWT format generated');
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.userId !== 'usr-test-123' || decoded.role !== 'customer') {
    throw new Error('Decoded token payload mismatch');
  }

  // 3. Tampered Token Detection
  const tamperedToken = token.slice(0, -5) + 'abcde';
  const tamperedDecoded = verifyToken(tamperedToken);
  if (tamperedDecoded !== null) {
    throw new Error('Tampered token was not rejected');
  }

  console.log('✓ JWT token generation, verification, and tamper protection passed');
}
