const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const monggose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        const payload = { _id: new monggose.Types.ObjectId().toHexString(), isAdmin: true };
        const user = new User(payload);
        
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(payload);
    });
});