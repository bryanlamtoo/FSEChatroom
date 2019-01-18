const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Define the user schema
const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    }
});



//Export the model
module.exports = mongoose.model('User', userSchema);