import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { config } from './index.js';

/**
 * Simple logger with 3 levels: error, info, debug
 *
 * Log level hierarchy:
 * - error: Only errors
 * - info: Errors + info messages
 * - debug: Errors + info + debug messages
 *
 * Logs are written to:
 * - Console (colorized, only in terminal)
 * - Single daily file: logs/YYYY-MM-DD.log (all logs based on LOG_LEVEL)
 */

// Log levels (lower number = higher priority)
const levels = {
  error: 0,
  info: 1,
  debug: 2,
};

// Colors for each level
const colors = {
  error: 'red',
  info: 'white',
  debug: 'yellow',
};

winston.addColors(colors);

// Console format (colorized)
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

// File format (JSON with full timestamp)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Single daily rotating file for all logs
const fileTransport = new DailyRotateFile({
  dirname: 'logs',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  format: fileFormat,
});

// Create logger
const logger = winston.createLogger({
  levels,
  level: config.logging.level,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // Single file transport
    fileTransport,
  ],
});

// Simple API
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
