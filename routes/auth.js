const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/login', authController.getLogin);


router.post('/login', (req, res, next) =>{
    console.log(req.body.username);

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.redirect('/auth/login?err');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/auth/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/auth/login');
                });
        })
        .catch(err => console.log(err));
});

router.post('/signup', authController.postSignUp);

router.get('/signup', authController.getSignUp);

// GET for logout logout
router.get('/logout', authController.postLogout);

module.exports = router;