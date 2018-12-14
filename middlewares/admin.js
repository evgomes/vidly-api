const errorResponse = require('../resources/error-response');

module.exports = function(req, res, next) {
    if(!req.user.isAdmin) {
        return res.status(403).send(errorResponse(['Access denied.']));
    }

    next();
}