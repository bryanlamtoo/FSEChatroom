const express = require('express');
const router = express.Router();

router.use('/home',(req,res,next)=>{
    console.log('In another middle ware');
    res.send('<p><h1>Welcom home</h1></p>');
});

//define the middleware 
router.get('/',(req, res, next)=>{
    console.log('In the middle ware');
    res.send('<p>Hello World</p>')
});






module.exports = router;

