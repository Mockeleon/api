import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { config } from './index.js';

/**
 * Logger - Error, info, and debug logging
 *
 * Features:
 * - Console output (colorized)
 * - Daily rotating file logs
 * - Configurable log level
 */

const levels = {
  error: 0,
  info: 1,
  debug: 2,
};

const colors = {
  error: 'red',
  info: 'white',
  debug: 'yellow',
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const timestamp = info.timestamp as string;
    const level = info.level;
    const message = info.message as string;
    return `${timestamp} [${level}] ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const fileTransport = new DailyRotateFile({
  dirname: 'logs',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
});

const logger = winston.createLogger({
  levels,
  level: config.logging.level,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    fileTransport,
  ],
});

export const log = {
  error: (message: string, meta?: unknown) => {
    logger.error(message, meta);
  },
  info: (message: string, meta?: unknown) => {
    logger.info(message, meta);
  },
  debug: (message: string, meta?: unknown) => {
    logger.debug(message, meta);
  },
};

export default log;
