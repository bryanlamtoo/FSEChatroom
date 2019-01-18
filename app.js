const http = require('http');
const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./util/path');
const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const errController = require('./controllers/error');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
const ChatMessage = require('./models/chatmessage');


//Import the routes for this application
const routes = require('./routes/routes');
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb://localhost:27017/chatdb';
// const MONGODB_URI = 'mongodb+srv://bryanlamtoo:SP04BW4RorKhMwdY@cluster0-4o8vi.mongodb.net/test'

//Application set up
const app = express();


//Initialise a new session store
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

//Set our global templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');


/**
 * **********************************    MIDDLE WARES DECLARATIONS **********************************
 */

//Middleware to Help with parsing form data that has been submitted
//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({extended: false}));

//Serve Static Files from the public directory
app.use(express.static(path.join(rootDir, 'public')));

//Configure the session here
app.use(
    session(
        {
            secret: 'my_secret',
            resave: false,
            saveUninitialized: false,
            store: store
        }));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});


//Use the routes
app.use(routes);

app.use('/auth', authRoutes);

app.use(errController.get404); //Add the error controller for displaying page not found


/**
 * ********************************** END MIDDLEWARE DECLARATIONS **********************************
 */



//Set up the database connection
mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    username: 'bryanlamtoo',
                    name: 'Bryan Lamtoo',
                    password: '1234',
                    passwordConf: '1234'

                });
                user.save();
            }
        });

        const server = app.listen(4000, function () {
            console.log('Listening to requests on port 4000')
        });

        //Socket set-up
        const io = socket(server);

//Listen for connections from clients
        io.on('connection', function (socket) {
            console.log('Made a socket connection');

            /* Listen for client chat messages. This is the socket for the particular client that sent the message
            *  The function receives the data coming in from the client and then the server sends out the message to all other clienst
            */
            socket.on('chat', function (data) {

                console.log(data);


                User.findById(data.userId)
                    .then(user => {


                        const chatMessage = new ChatMessage({
                            userId: user,
                            message: data.message,
                            date: new Date()
                        });

                        //save the chat to the database
                        chatMessage.save();

                        const outputdata = {
                            name: user.name,
                            message: chatMessage.message,
                            date: chatMessage.date
                        };

                        // Send the data out to all sockets on the server i.e client connections waiting for communicartion
                        socket.broadcast.emit('chat', outputdata);

                    });


            });

            socket.on('typing', function (data) {
                //Broadcasts the message to every other client except this particular one
                socket.broadcast.emit('typing', data)
            });
        });

    })
    .catch(err => {
        console.log(err);
    });

//opens a connection to the database


