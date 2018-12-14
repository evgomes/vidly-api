const request = require('supertest');
let server;

const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genre');

describe('auth middleware', () => {
    let token;

    const getResponse = () => {
        return request(server).post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    beforeEach(() => { 
        server = require('../../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => { 
        await server.close();
        await Genre.remove({});
    });

    it('should return 401 if no token is provided', async () => {
        token = '';
        const response = await getResponse();

        expect(response.status).toBe(401);
    });
    
    it('should return 400 if invalid token is provided', async () => {
        token = null;
        const response = await getResponse();

        expect(response.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const response = await getResponse();

        expect(response.status).toBe(200);
    });
});