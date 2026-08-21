type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = ['password', 'passwordHash', 'token', 'secret', 'cardCvv', 'cardNumber', 'bankOtp', 'otp'];

function redactSensitiveData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redactSensitiveData);

  const redacted: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      redacted[key] = redactSensitiveData(val);
    } else {
      redacted[key] = val;
    }
  }
  return redacted;
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const payload = meta ? ` | ${JSON.stringify(redactSensitiveData(meta))}` : '';
    console.log(`[${timestamp}] [INFO] ${message}${payload}`);
  },

  warn(message: string, meta?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const payload = meta ? ` | ${JSON.stringify(redactSensitiveData(meta))}` : '';
    console.warn(`[${timestamp}] [WARN] ${message}${payload}`);
  },

  error(message: string, error?: any, meta?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const errDetails = error ? ` | Error: ${error.message || error}` : '';
    const payload = meta ? ` | ${JSON.stringify(redactSensitiveData(meta))}` : '';
    console.error(`[${timestamp}] [ERROR] ${message}${errDetails}${payload}`);
  },

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      const payload = meta ? ` | ${JSON.stringify(redactSensitiveData(meta))}` : '';
      console.debug(`[${timestamp}] [DEBUG] ${message}${payload}`);
    }
  },
};
