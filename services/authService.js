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
                    message: "That email address already exists."
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
                    var token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 600
                    });

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