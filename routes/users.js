const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (server) => {
    //Register User

    server.post('/register', (req, res, next) => {
        const { email, password } = req.body;

        //Create user, encrypt password
        const user = new User({
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                //Hash password
                user.password = hash;

                try {
                    const newUser = await user.save();
                    res.send(201);
                    next();
                } catch(err) {
                    return next(new errors.InternalError(err.message));
                }
            });
        });
    });

    //Auth user
    server.post('/auth', async (req, res, next) => {
        const {email, password} = req.body;
        console.log('hitAUTH')
        try {
            //Authenticate User
            const user = await auth.authenticate(email, password);

            //Create a token

            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, 
            {expiresIn: "15min"});

            const {iat, exp} = jwt.decode(token);

            //Respond with token
            res.send({iat, exp, token})

            next();
        } catch(err) {
            //User unauthorized
            return next(new errors.UnauthorizedError(err));
        }
    });
}