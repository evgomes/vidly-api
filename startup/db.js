const mongoose = require('mongoose');
const logger = require('../services/logger');
const config = require('config');

module.exports = function () {
    const db = config.get('db');

    mongoose
        .connect(db, { useNewUrlParser: true })
        .then(() => logger.info(`Connected to ${db}...`));
}