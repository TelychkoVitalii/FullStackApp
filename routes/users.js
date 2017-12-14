const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in Models
const User = require('../models/user');

// Register Form
router.get('/register', function (req, res) {
    res.render('register')
});

// Login Form
router.get('/login', function (req, res) {
    res.render('login');
});

// Register Process
router.post('/register', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'passwords is required').equals(req.body.password);

    const errors = req.validationErrors();

    if(errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if(err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if(err) {
                        console.log(err);
                    } else {
                        req.flash('success', 'You are now register and can log in');
                        res.redirect('login');
                    }
                })
            });
        })
    }
});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;