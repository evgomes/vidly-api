const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

const _ = require('lodash');
const cryptoHelper = require('../helpers/crypto-helper');

const validate = require('../middlewares/validate');

const successResponse = require('../resources/success-response');
const errorResponse = require('../resources/error-response');

const { User, validateUser, findUserById } = require('../models/user');

router.get('/me', auth, async (req, res) => {
    const user = await findUserById(req.user._id, false);
    return res.send(successResponse(user));
});

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send(errorResponse(['Email already in use.']));

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await cryptoHelper.hash(user.password);

    await user.save();

    const userResource = _.pick(user, ['_id', 'name', 'email']);
    const token = user.generateAuthToken();

    return res.header('x-auth-token', token).send(successResponse(userResource));
});

module.exports = router;