const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define the user schema
const chatSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    message: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },

    date: {
        type: Date,
        require: true
    }
});


//Export the model
module.exports = mongoose.model('ChatMessage', chatSchema);