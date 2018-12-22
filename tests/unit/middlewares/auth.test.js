const mongoose = require('mongoose');
const auth = require('../../../middlewares/auth');

const { User } = require('../../../models/user');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = { 
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true 
        };

        const token = new User(user).generateAuthToken();
        const req = { header: jest.fn().mockReturnValue(token) };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});