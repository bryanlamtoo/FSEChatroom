const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');

router.use('/home', (req, res) => {

    res.sendFile(path.join(rootDir, 'views', 'chat.html'));
});

//define the middleware 
router.get('/', (req, res, next) => {
    console.log('In the middle ware');
    res.send('<p>Hello World</p>')
});


module.exports = router;

