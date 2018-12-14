const mongoose = require('mongoose');
const errorResponse = require('../resources/error-response');

module.exports = function(req, res, next) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send(errorResponse(['Not found.']));
    }

    next();
}