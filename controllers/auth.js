const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postSignUp = (req, res, next) => {

    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    User.findOne({username: username})
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/auth/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        username: username,
                        password: hashedPassword,
                        name: name,
                        passwordConf: confirmPassword

                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/auth/login');
                });
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postLogin = (res, req) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username})
        .then(user => {
            if (!user) {
                return res.redirect('/login');
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
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));

};


exports.postLogout = (req, res, next) => {
    // delete session object
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });

};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};


exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};
