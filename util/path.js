const path = require('path');

//Get the path to the file that is responsible for running this application which should be the root folder
module.exports = path.dirname(process.mainModule.filename);