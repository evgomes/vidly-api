function getErrorMessages(validationError) {
    let errors = [];

    if(!validationError.details) {
        errors.push(validationError.message);
        return errors;
    }

    for(let detail of validationError.details) {
        errors.push(detail.message);
    }

    return errors;
}

function createObjectIdError(field) {
    return new Error(`Specify a valid ID for field "${field}".`);
}

module.exports.getErrorMessages = getErrorMessages;
module.exports.createObjectIdError = createObjectIdError;