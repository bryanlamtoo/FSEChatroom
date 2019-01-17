const http = require('http');
const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./util/path');

//Import the routes for this aplication
const routes = require('./routes/routes');

//Applicaiton set up
const app = express();


/**
 * **********************************    MIDDLE WARES DECLARATIONS **********************************
 */

//Middleware to Help with parsing form data that has been submitted
app.use(bodyParser.urlencoded({extended: false}));


//Static Files
app.use(express.static(path.join(rootDir, 'public')));

//Use the routes
app.use(routes);

app.use((req, res, next) => {
    console.log(req.body);

    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));

});


/**
 * ********************************** END MIDDLEWARE DECLARATIONS **********************************
 */

let server = null;

//Set up the database connection
mongoose.connect('mongodb://localhost:27017/chatdb', {useNewUrlParser: true})
    .then(result => {

        server = app.listen(4000, function () {
            console.log('Listening to requests on port 4000')
        });

        setUpSocket(server);

    })
    .catch(err => {
        console.log(err);
    });

//opens a connection to the database


function setUpSocket(server) {
    if (server != null) {

//Socket set-up
        const io = socket(server);

//Listen for connections from clients
        io.on('connection', function (socket) {
            console.log('Made a socket connection');

            /* Listen for client chat messages. This is the socket for the particular client that sent the message
            *  The function receives the data coming in from the client and then the server sends out the message to all other clienst
            */
            socket.on('chat', function (data) {

                // Send the data out to all sockets on the server i.e client connections waiting for communicartion
                io.sockets.emit('chat', data);
            });

            socket.on('typing', function (data) {
                //Broadcasts the message to every other client except this particular one
                socket.broadcast.emit('typing', data)
            });
        });

    }else
        console.log('Server is null')
}

