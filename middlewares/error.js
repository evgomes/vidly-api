const errorResponse = require('../resources/error-response');
const logger = require('../services/logger');

module.exports = function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send(errorResponse([err.message]));
}