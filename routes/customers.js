const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = (server) => {
    // Get Customers
    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({});
            res.send(customers);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Post customer
    server.post('/customers', async (req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        //Create new customer
        const {name, email, balance} = req.body;

        const customer = new Customer({
            name,
            email,
            balance
        });

        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch(err){
            return next(new errors.InternalError(err.message));
        }
    });

    //Get individual user

    server.get('/customers/:id', async (req, res, next) => {
        try {
            const params = req.params.id;
            const customer = await Customer.findById(params);
            res.send(customer);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer with ID ${params}`));
        }
    });
};