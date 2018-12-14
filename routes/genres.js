const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validate-object-id');
const validate = require('../middlewares/validate');

const successResponse = require('../resources/success-response');
const errorResponse = require('../resources/error-response');

const { Genre, validateGenre } = require('../models/genre');

/**
 * Lists all genres.
 */
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    return res.send(successResponse(genres));
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send(errorResponse(['Genre not found.']));

    return res.send(successResponse(genre));
});

router.post('/', [auth, validate(validateGenre)], async (req, res) => {
    const genre = new Genre({ name: req.body.name });
    await genre.save();

    return res.send(successResponse(genre));
});

router.put('/:id', [auth, validateObjectId, validate(validateGenre)], async (req, res) => {
    let genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send(errorResponse(['Genre not found.']));

    genre.set({ name: req.body.name });
    await genre.save();

    return res.send(successResponse(genre));
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send(errorResponse(['Genre not found.']));

    await Genre.deleteOne(+req.param.id);
    return res.send(successResponse(genre));
});

module.exports = router;