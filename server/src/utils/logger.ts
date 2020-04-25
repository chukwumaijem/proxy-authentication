import { createLogger, transports, format } from 'winston';

const { combine, timestamp, prettyPrint } = format;

const options = {
  level: 'debug',
  handleExceptions: true,
};

export const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.Console(options)],
  exitOnError: false,
});