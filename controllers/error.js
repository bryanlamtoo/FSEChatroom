const path = require('path');
const rootDir = require('../util/path');


exports.get404 = (req, res) => {
    console.log(req.body);

    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn
    });

};