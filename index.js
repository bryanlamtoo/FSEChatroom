const http = require('http');
const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Import the routes for this aplication
const routes = require('./routes/routes');

// mongoose.connect('http://localhost/chatdb'); //opens a connection to the database

// //set up notification if we have successfully connected
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Connnection Error:'));
// db.once('open', ()=>{
//     console.log('Connection opened!');
// });


//Applicaiton set up
const app = express();


/**
 * **********************************    MIDDLE WARES DECLARATIONS **********************************
 */

//Middleware to Help with parsing form data that has been submitted
app.use(bodyParser.urlencoded({extended:false}));

//Use the routes
app.use(routes);

app.use((req, res, next)=>{
    console.log(req.body);

    res.status(404).send('<p>Page Not Found</p>');

});

/**
 * ********************************** END MIDDLEWARE DECLARATIONS **********************************
 */



//Server set-up
var server = app.listen(4000,function(){
    console.log('Listening to requests on port 4000')
})



//Static Files
app.use(express.static('public'));

//Socket set-up
var io = socket(server);

//Listen for connections from clients
io.on('connection', function(socket){
    console.log('Made a socket connection');

    /* Listen for client chat messages. This is the socket for the particular client that sent the message
    *  The function receives the data coming in from the client and then the server sends out the message to all other clienst
    */
    socket.on('chat',function(data){

        // Send the data out to all sockets on the server i.e client connections waiting for communicartion
        io.sockets.emit('chat',data);
    });

    socket.on('typing',function(data){
        //Broadcasts the message to every other client except this particular one
        socket.broadcast.emit('typing',data)
    });
});