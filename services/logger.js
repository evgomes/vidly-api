const winston = require('winston');
const moment = require('moment');
const config = require('config');
require('winston-mongodb');

const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: () => moment().format('YYYY-MM-DD HH:mm:ss')
  }),
  winston.format.printf((info) => {
    return `${info.timestamp} - ${info.level.toUpperCase()}: ${info.message}`;
  })
);

const infoTransport = new winston.transports.Console({ format: consoleFormat });
//const monboDbTransport = new winston.transports.MongoDB({ level: 'error', db: config.get('db') });

const logger = winston.createLogger({
  transports: [infoTransport]//, monboDbTransport]
});

module.exports = logger;

/*
const errorFormat = winston.format.combine(
  winston.format(info => {
    if (!info instanceof Error) {
      return info;
    }

    return Object.assign({}, info, {
      message: info.message,
      stack: info.stack,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  })(),
  winston.format.json()
);
*/


/*
const errorTransport = new winston.transports.File({
  format: errorFormat,
  level: 'error',
  filename: './log/errors-log.txt',
  handleExceptions: true
});
*/