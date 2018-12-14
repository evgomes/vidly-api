const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const validateObjectId = require('../middlewares/validate-object-id');

const successResponse = require('../resources/success-response');
const errorResponse = require('../resources/error-response');

const { Customer, validateCustomer } = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    return res.send(successResponse(customers));
});

router.get('/:id', validateObjectId, async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send(errorResponse(['Customer not found.']));

    return res.send(successResponse(customer));
});

router.post('/', [auth, validate(validateCustomer)], async (req, res) => {
    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    await customer.save();
    return res.send(successResponse(customer));
});

router.put('/:id', [auth, validateObjectId, validate(validateCustomer)], async (req, res) => {
    let customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send(errorResponse(['Customer not found.']));

    customer.set({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    await customer.save();
    return res.send(successResponse(customer));
});

router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    let customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send(errorResponse(['Customer not found.']));
    
    await Customer.deleteOne(+req.param.id);
    return res.send(successResponse(customer));
});

module.exports = router;