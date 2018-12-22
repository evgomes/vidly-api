function errorResponse(messages) {
    return {
        success: false,
        messages: messages
    }
}

module.exports = errorResponse;