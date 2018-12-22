//Check if there is a user by their email
//Check if email matches

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
    return new Promise( async (resolve, reject) => {
        try {
            //Get user by email
            const user = await User.findOne({email});

            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    resolve(user);
                } else {
                    //Pass didn't match
                    reject('Authentication failed');
                }
            });

        } catch(err) {
            //email not found
            reject('Authentication Failed');
        }
    })
};
