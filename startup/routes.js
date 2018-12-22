const express = require('express');
const helmet = require('helmet');

const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const users = require('../routes/users');
const auth = require('../routes/auth');

const error = require('../middlewares/error');

module.exports = function (app) {
    app.use(helmet());
    app.use(express.json());

    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use('/api/users', users);
    app.use('/api/auth', auth);

    app.use(error);
}