const fs = require("fs");
const path = require("path");

const winston = require("winston");
const { format } = winston;
const { combine, label, json, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(
    label({ label: "category one" }),
    json(),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File({
      level: "info",
      filename: path.join(__dirname, "info.log")
    }),
    new winston.transports.File({
      level: "error",
      filename: path.join(__dirname, "error.log")
    }),
    new winston.transports.Http({
      level: "http",
      host: "localhost",
      port: 8080
    }),
    new winston.transports.Console({ level: "warn" })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "exceptions.log")
    })
  ],
  exitOnError: false
});
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

module.exports = logger;
