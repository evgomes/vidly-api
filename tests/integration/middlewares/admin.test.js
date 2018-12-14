const request = require('supertest');
let server;

const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genre');

describe('admin middleware', () => {
    let token;
    let genreId;

    const getResponse = () => {
        return request(server).delete('/api/genres/' + genreId)
            .set('x-auth-token', token)
            .send({ name: 'updatedGenre' });
    };

    beforeEach(async () => {
        server = require('../../../index');

        const genre = new Genre({ name: 'genre1' });
        await genre.save();

        genreId = genre._id;
        token = new User({ isAdmin: true }).generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    it('should return 403 is user is not an admin', async () => {
        token = new User().generateAuthToken();
        const response = await getResponse();

        expect(response.status).toBe(403);
    });

    it('should return 200 is user is admin', async () => {
        const response = await getResponse();

        expect(response.status).toBe(200);
    });
});