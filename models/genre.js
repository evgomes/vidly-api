const mongoose = require('mongoose');

const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('genres', genreSchema);

function validateGenre(genre) {
    const squema = { name: Joi.string().required().min(5).max(50) };
    return Joi.validate(genre, squema, { abortEarly: false });
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;