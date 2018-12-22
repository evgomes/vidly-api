const mongoose = require('mongoose');
const moment = require('moment');

const Joi = require('joi');

const { createObjectIdError } = require('../helpers/joi-helper');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
});

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('rentals', rentalSchema);

function validateRental(movie) {
    return validate(movie);
}

function validateReturn(rentalReturn) {
    return validate(rentalReturn);
}

function validate(obj) {
    const squema = {
        customerId: Joi.objectId().required().error(createObjectIdError("customerId")),
        movieId: Joi.objectId().required().error(createObjectIdError("movieId"))
    };

    return Joi.validate(obj, squema, { abortEarly: false });
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
module.exports.validateReturn = validateReturn;