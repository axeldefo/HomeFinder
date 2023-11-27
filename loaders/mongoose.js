'use strict';


const mongoose = require('mongoose');
const { mongo } = require('../config');
var debug = require('debug')('backend:loaders:mongoose');


// setting strictQuery to false to be ready for mongoose 7
mongoose.set('strictQuery', false);

// Exit application on error
mongoose.connection.on('error', (err) => {
    debug(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = async function () {
  // Connect to database
  try {
    await mongoose.connect(mongo.uri, mongo.options);

    mongoose.connection.on('disconnected', error => {
        debug('Error: disconnected!\r\n' + error);
        debug('Mongoose default connection disconnected');
        debug(error);
      if ( error != undefined && error.reason != undefined ) {
        debug('reason : ' + error.reason);
      }
    });
    mongoose.connection.on('reconnected', error => {
      debug('Info: reconnected!\r\n' + error);
      debug('Mongoose default connection reconnected');
    });
    mongoose.connection.on('error', error => {
      debug('Error: errored!\r\n' + error);
      debug('Mongoose default received error ');
      debug(error);
      if ( error != undefined && error.reason != undefined ) {
        debug('reason : ' + error.reason); 
      }
    });
    debug('Connected to database');
  } catch (error) {
    debug('Failed to connect to db  ' + JSON.stringify(error));
    debug(error);
    process.exit(1);
  }

  return;
};


