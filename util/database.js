const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;



const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://bryanlamtoo:SP04BW4RorKhMwdY@cluster0-4o8vi.mongodb.net/test?retryWrites=true')
        .then(result => {
            console.log('Connected');

            callback(result);
        })
        .catch(err => {
            console.log(err);
        })
};

module.exports = mongoConnect;