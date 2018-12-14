const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
Fawn.init(mongoose);

const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validate-object-id');
const validate = require('../middlewares/validate');

const successResponse = require('../resources/success-response');
const errorResponse = require('../resources/error-response');

const { Rental, validateRental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    return res.send(successResponse(rentals));
});

router.get('/:id', validateObjectId, async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send(errorResponse(['Rental not found.']));

    return res.send(successResponse(rental));
});

router.post('/', [auth, validate(validateRental)], async (req, res) => {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send(errorResponse(['Invalid customer.']));

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send(errorResponse(['Invalid movie.']));

    if (movie.numberInStock === 0) {
        return res.status(400).send(errorResponse(['Movie not in stock.']));
    }

    let rental = new Rental(buildRental(customer, movie));

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: {
                    numberInStock: -1
                }
            })
            .run();

        return res.send(successResponse(rental));
    }
    catch (err) {
        return res.status(500).send(errorResponse([err.message]));
    }
});

function buildRental(customer, movie) {
    return {
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    };
}

module.exports = router;