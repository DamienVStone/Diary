var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var passport = require('passport');

var authService = {};

authService.register = function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({
            success: false,
            message: 'Please enter an email and password to register.'
        });
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });

        newUser.save(function(err) {
            if (err) {
                return res.json({
                    success: false,
                    message: "That email address already exists. " + err
                });
            }

            res.json({
                success: true,
                message: 'Successfully created new user.'
            });
        });
    }
};

authService.authenticate = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        console.log('Found user: ' + user.email);
        if (err) {
            throw err;
        }
        if (!user) {
            res.send({
                success: false,
                message: "User not found."
            });
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    console.log("Password is ok for: " + user.email);
                    var token = jwt.sign({ email: user.email, password: user.password, _id: user._id }, config.secret, {
                        expiresIn: 600
                    });

                    jwt.verify(token, config.secret, function(err, data) {
                        console.log(err, data);
                    })

                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'User not found.'
                    });
                }
            });
        }
    });
};

authService.authorized = passport.authenticate('jwt', {
    session: false
});

module.exports = {
    'AuthService': authService
};