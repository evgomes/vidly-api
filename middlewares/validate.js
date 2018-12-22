const joiHelper = require('../helpers/joi-helper');

const errorResponse = require('../resources/error-response');

module.exports = (validator) => {
    return (req, res, next) => {
        const { error: validationError } = validator(req.body);
        if (validationError) return res.status(400).send(errorResponse(joiHelper.getErrorMessages(validationError)));

        next();
    }
}