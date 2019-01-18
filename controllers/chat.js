const path = require('path');
const rootDir = require('../util/path');
const User = require('../models/user');

exports.getIndex = (req, res) => {

    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    User.find().then(users => {

        res.render('chat/chat', {
            path: '/',
            pageTitle: 'FSE ChatRoom',
            isAuthenticated: req.session.isLoggedIn,
            curr_user: req.session.user,
            all_users: users
        });
    })
    ;
};