const mongoose = require('mongoose');

const Joi = require('joi');

const Customer = mongoose.model('customers', new mongoose.Schema({
    isGold: { type: Boolean, required: true },
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    phone: { type: String, required: true, minlength: 5, maxlength: 15 }
}));

function validateCustomer(genre) {
    const squema = {
        isGold: Joi.boolean().required(),
        name: Joi.string().required().min(2).max(50),
        phone: Joi.string().required().min(5).max(15),
    };

    return Joi.validate(genre, squema, { abortEarly: false });
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;