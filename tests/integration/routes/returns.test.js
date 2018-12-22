const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');

const { Movie } = require('../../../models/movie');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let movie;
    let rental;
    let token;
    let payload;

    getResponse = () => {        
        return request(server).post('/api/returns')
                              .set('x-auth-token', token)
                              .send(payload);
    };

    beforeEach(async () => {
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        payload = { customerId, movieId };

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {
                name: '12345'
            },
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const response = await getResponse();
        
        expect(response.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        delete payload.customerId;
        const response = await getResponse();

        expect(response.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        delete payload.movieId;
        const response = await getResponse();

        expect(response.status).toBe(400);
    });

    it('should return 404 if no rental found for customer/movie', async() => {
        await Rental.remove({});
        const response = await getResponse();

        expect(response.status).toBe(404);
    });

    it('should return 400 if rental was already processed', async() => {
        rental.dateReturned = Date.now();
        await rental.save();

        const response = await getResponse();

        expect(response.status).toBe(400);
    });

    it('should return 200 for valid request', async() => {
        const response = await getResponse();

        expect(response.status).toBe(200);
    });

    it('should set the return date when a valid request is sent', async() => {
        await getResponse();

        const rentalIdDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalIdDb.dateReturned;
        
        expect(rentalIdDb.dateReturned).toBeDefined();
        expect(diff).toBeLessThanOrEqual(10 * 1000);
    });

    it('should set the rental fee when a valid request is sent', async() => {
        rental.dateOut = moment().add(-7, 'days').toDate(); 
        await rental.save();

        await getResponse();

        const rentalIdDb = await Rental.findById(rental._id);
        
        expect(rentalIdDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock', async() => {
        await getResponse();

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid', async() => {
        const response = await getResponse();

        const rentalInDb = await Rental.findById(rental._id);
        
        expect(response.body.data).toHaveProperty('_id', rentalInDb._id.toHexString());
        expect(Object.keys(response.body.data)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
        );
    });
});