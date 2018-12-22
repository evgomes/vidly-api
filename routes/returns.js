const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const { Rental, validateReturn } = require('../models/rental');
const { Movie } = require('../models/movie');

const errorResponse = require('../resources/error-response');
const successResponse = require('../resources/success-response');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send(errorResponse(['Rental not found.']));
    if(rental.dateReturned) return res.status(400).send(errorResponse(['Rental already processed.']));

    rental.return();
    await rental.save();
    
    await Movie.update({ _id: rental.movie._id }, {
        $inc: { 
            numberInStock: 1
        }
    });

    return res.send(successResponse(rental));
});

module.exports = router;