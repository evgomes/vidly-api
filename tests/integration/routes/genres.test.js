const mongoose = require('mongoose');
const request = require('supertest');
let server;

const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

describe('/api/genres', () => {
    beforeEach(() => server = require('../../../index'));

    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            const genres = [
                { name: 'genre1' },
                { name: 'genre2' }
            ];
            await Genre.collection.insertMany(genres);

            const response = await request(server).get('/api/genres');

            expect(response.status).toBe(200);
            expect(response.body.data.some(g => g.name === 'genre1')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genreId' });
            await genre.save();

            const response = await request(server).get('/api/genres/' + genre._id);

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const response = await request(server).get('/api/genres/1');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        it('should return 404 if no genre with the given id is found', async () => {
            const id = new mongoose.Types.ObjectId();
            const response = await request(server).get('/api/genres/' + id);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /', () => {
        let token;
        let genreName;

        const getResponse = async () => {
            return await request(server).post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: genreName });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            genreName = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const response = await getResponse();

            expect(response.status).toBe(401);
        });

        it('should return 400 if genre name has less than 5 characters', async () => {
            genreName = '1234';
            const response = await getResponse();

            expect(response.status).toBe(400);
            expect(response.body.messages.some(m => m.match(/5/))).toBeTruthy();
        });

        it('should return 400 if genre name has more than 50 characters', async () => {
            genreName = 'a'.repeat(51);
            const response = await getResponse();

            expect(response.status).toBe(400);
            expect(response.body.messages.some(m => m.match(/50/))).toBeTruthy();
        });

        it('should save the genre if it is valid', async () => {
            await getResponse();

            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre with 200 status if it is valid', async () => {
            const response = await getResponse();

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let genreId;
        let genreName;
        
        const getResponse = () => {
            return request(server).put('/api/genres/' + genreId)
                .set('x-auth-token', token)
                .send({ name: genreName });
        }

        beforeEach(async () => {
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            
            genreId = genre._id;
            genreName = genre.name;
            token = new User().generateAuthToken();
        });

        afterEach(async () => {
            await Genre.remove({});
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const response = await getResponse();

            expect(response.status).toBe(401);
        });

        it('should return 404 if invalid genre id is given', async () => {
            genreId = '1';
            const response = await getResponse();

            expect(response.status).toBe(404);
        });

        it('should return 404 if no genre with the given id is found', async () => {
            genreId = new mongoose.Types.ObjectId().toHexString();
            const response = await getResponse();

            expect(response.status).toBe(404);
        });

        it('should return 400 if genre name has less than 5 characters', async () => {
            genreName = '1234';
            const response = await getResponse();

            expect(response.status).toBe(400);
            expect(response.body.messages.some(m => m.match(/5/))).toBeTruthy();
        });

        it('should return 400 if genre name has more than 50 characters', async () => {
            genreName = 'a'.repeat(51);
            const response = await getResponse();

            expect(response.status).toBe(400);
            expect(response.body.messages.some(m => m.match(/50/))).toBeTruthy();
        });

        it('should save the genre if it is valid', async () => {
            genreName = 'updatedGenre';
            await getResponse();

            const genre = await Genre.findById(genreId);

            expect(genre).not.toBeNull();
            expect(genre).toHaveProperty('_id', genreId);
            expect(genre).toHaveProperty('name', 'updatedGenre');
        });

        it('should return the genre with 200 status if it is valid', async () => {
            const response = await getResponse();

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('_id', genreId.toHexString());
            expect(response.body.data).toHaveProperty('name', 'genre1');
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genreId;
        let genreName;
        
        const getResponse = () => {
            return request(server).delete('/api/genres/' + genreId)
                .set('x-auth-token', token)
                .send({ name: genreName });
        }

        beforeEach(async () => {
            server = require('../../../index');
            const genre = new Genre({ name: 'genre1' });
            await genre.save();
            
            genreId = genre._id;
            genreName = genre.name;
            token = new User({ isAdmin: true }).generateAuthToken();
        });

        afterEach(async () => {
            await server.close();
            await Genre.remove({});
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            const response = await getResponse();

            expect(response.status).toBe(401);
        });

        it('should return 403 if client is not an admin', async () => {
            token = new User().generateAuthToken();
            const response = await getResponse();

            expect(response.status).toBe(403);
        });

        it('should return 404 if invalid genre id is given', async () => {
            genreId = '1';
            const response = await getResponse();

            expect(response.status).toBe(404);
        });

        it('should return 404 if no genre with the given id is found', async () => {
            genreId = new mongoose.Types.ObjectId().toHexString();
            const response = await getResponse();

            expect(response.status).toBe(404);
        });

        it('should delete the genre if it existis', async () => {
            await getResponse();

            const genre = await Genre.findById(genreId);

            expect(genre).toBeNull();
        });

        it('should return the genre with 200 status if it was deleted succesfully', async () => {
            const response = await getResponse();

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('_id', genreId.toHexString());
            expect(response.body.data).toHaveProperty('name', 'genre1');
        });
    });
});