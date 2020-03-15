/* eslint-disable no-shadow */
const path = require('path');

const winston = require('winston');

const { format } = winston;
const {
  combine, label, json, timestamp, printf,
} = format;
// specify output format
const myFormat = printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
);

const logger = winston.createLogger({
  // combine both json and timestamp for log output
  format: combine(
    label({ label: 'category one' }),
    json(),
    timestamp(),
    myFormat,
  ),
  transports: [
    // all logs info and above should be looged in the info.log
    new winston.transports.File({
      level: 'info',
      filename: path.join(__dirname, 'info.log'),
    }),
    // all error logs should be logged in the file
    new winston.transports.File({
      level: 'error',
      filename: path.join(__dirname, 'error.log'),
    }),
    // all http request to be logged in the info
    new winston.transports.Http({
      level: 'http',
      host: 'localhost',
      port: 8080,
    }),
    // all log with level of warn should be outputed on the console
    new winston.transports.Console({ level: 'warn' }),
  ],
  // all exceptions should be logged in the exceptions.log
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, 'exceptions.log'),
    }),
  ],
  // loggers should not exit if there are exceptions, only log it
  exitOnError: false,
});
logger.stream = {
  write(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
