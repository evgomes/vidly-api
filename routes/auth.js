const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate');
const cryptoHelper = require('../helpers/crypto-helper');

const successResponse = require('../resources/success-response');
const errorResponse = require('../resources/error-response');

const { User } = require('../models/user');
const Joi = require('joi');

router.post('/', validate(validateLoginRequest), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send(errorResponse(['Invalid email or password.']));

    const validPassword = await cryptoHelper.hashMatches(req.body.password, user.password);
    if(!validPassword) return res.status(400).send(errorResponse(['Invalid email or password.']));

    const token = user.generateAuthToken();
    return res.send(successResponse({ token: token }));
});

function validateLoginRequest(req) {
    const squema = {
        email: Joi.string().required().max(255).email(),
        password: Joi.string().required().min(6).max(255)
    };

    return Joi.validate(req, squema, { abortEarly: false });
}

module.exports = router;