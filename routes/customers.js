const errors = require('restify-errors');
const Customer = require('../models/Customer');
const rjwt = require('restify-jwt-community');
const config = require('../config');

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
    server.post('/customers', rjwt({secret: config.JWT_SECRET}), async (req, res, next) => {
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

        // Update customer
        server.put('/customers/:id', rjwt({secret: config.JWT_SECRET}), async (req, res, next) => {
            //Check for JSON
            if(!req.is('application/json')){
                return next(new errors.InvalidContentError("Expects 'application/json'"))
            }
    
            try {
                const customer = await Customer.findOneAndUpdate({
                    _id: req.params.id
                }, req.body);
                res.send(201);
                next();
            } catch(err){
                return next(new errors.ResourceNotFoundError(`There is no customer with ID ${params}`));
            }
        });

        server.del('/customers/:id', rjwt({secret: config.JWT_SECRET}), async(req,res,next) => {
            try{
                const customer = await Customer.findOneAndRemove({_id: req.params.id});
                res.send(204);
                next();
            } catch(err){
                return next(new errors.ResourceNotFoundError(`There is no customer with ID ${params}`));
            }
        })
};