const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('users', userSchema);

function validateUser(user) {
    const squema = {
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().max(255).email(),
        password: Joi.string().required().min(6).max(255)
    };

    return Joi.validate(user, squema, { abortEarly: false });
}

async function findUserById(id, includePassword) {
    try {
        if (includePassword) {
            return await User.findById(id);
        }

        return await User.findById(id).select('-password');
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.findUserById = findUserById;