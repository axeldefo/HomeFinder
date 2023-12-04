// Desc: Service for users

'use strict';

const User = require('../models/users');
var crypto = require('crypto');
var debug = require('debug')('backend:services:users');


exports.getUser = async (email) => { 
    if (!email) {
        debug('Missing required fields : ', email);
        return undefined;
    }
    try {
    return User.findOne({"email": email});
    } catch (error) {
        debug('error searching for user', error);
        return undefined;
    }
};

//