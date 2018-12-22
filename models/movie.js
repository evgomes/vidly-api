const mongoose = require('mongoose');

const Joi = require('joi');

const { createObjectIdError } = require('../helpers/joi-helper');

const { genreSchema } = require('./genre');

const Movie = mongoose.model('movies', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    numberInStock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    genre: {
        type: genreSchema,
        required: true
    }
}));

function validateMovie(movie) {
    const squema = { 
        title: Joi.string().required().min(3).max(50),
        numberInStock: Joi.number().required().min(0),
        dailyRentalRate: Joi.number().required().min(0),
        genreId: Joi.objectId().required().error(createObjectIdError("genreId"))
    };
    
    return Joi.validate(movie, squema, { abortEarly: false });
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;