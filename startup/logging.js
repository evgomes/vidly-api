const logger = require('../services/logger');
require('express-async-errors');

module.exports = function () {
    // Catches all unhandled exceptions from synchronous code.
    process.on('uncaughtException', (err) => {
        logger.error(err.message, err);
        process.exit(1);
    });

    // Catches all unhandled promise rejections.
    process.on('unhandledRejection', (err) => {
        logger.error(err.message, err);
        process.exit(1);
    });
}