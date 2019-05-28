/** @format */

import winston from 'winston';
const { format, transports } = winston;

const cformat = format.printf(
  ({ timestamp, level, message }): string => {
    return `${timestamp} [${level}] : ${message}`;
  }
);

var logger = winston.createLogger({
  level: 'verbose',
  format: format.combine(format.timestamp(), format.colorize(), cformat),
  transports: [new transports.Console()],
});

export function catcher(err: Error) {
  logger.error(err);
}

export default logger;
