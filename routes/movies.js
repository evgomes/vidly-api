const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validate-object-id');
const validate = require('../middlewares/validate');

const successResponse = require('../resources/success-response');
const errorResponse = require('../resources/error-response');

const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    return res.send(successResponse(movies));
});

router.get('/:id', validateObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send(errorResponse(['Movie not found.']));

    return res.send(successResponse(movie));
});

router.post('/', [auth, validate(validateMovie)], async (req, res) => {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(errorResponse(['Invalid genre.']));

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    await movie.save();
    return res.send(successResponse(movie));
});

router.put('/:id', [auth, validateObjectId, validate(validateMovie)], async (req, res) => {
    let movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send(errorResponse(['Movie not found.']));

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send(errorResponse(['Invalid genre.']));

    movie.set({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    await movie.save();
    return res.send(successResponse(movie));
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    let movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send(errorResponse(['Movie not found.']));

    await Movie.deleteOne(+req.param.id);
    return res.send(successResponse(movie));
});

module.exports = router;