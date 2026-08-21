import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'buyzo-super-secret-key-production-grade-2026-auth',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  DB_PATH: process.env.DB_PATH || path.join(process.cwd(), 'backend', 'data', 'buyzo_store.json'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
