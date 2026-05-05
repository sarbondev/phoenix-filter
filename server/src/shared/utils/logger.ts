import pino from 'pino';
import { env } from '../../config/env';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: { env: env.NODE_ENV, service: 'ecommerce-backend' },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'headers.authorization',
      'headers.cookie',
      'password',
      '*.password',
      'currentPassword',
      'newPassword',
      'token',
      '*.token',
      'accessToken',
      'refreshToken',
      'phoneNumber',
      '*.phoneNumber',
    ],
    censor: '[REDACTED]',
  },
});
