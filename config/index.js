'use strict';

const fs = require('fs');

// import .env variables
if (fs.existsSync('../.env')) {
  require('dotenv').config({
    allowEmptyValues: true,
    example: './.env.example',
    path: './.env',
  });
}

module.exports =  {
    
    mongo: {
        uri : process.env.MONGO_URI,
        options: {
          minPoolSize: 200,
          socketTimeoutMS: 600000,
        },
    },
}

