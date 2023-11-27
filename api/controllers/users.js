
'use strict';

const users = require("../../models/users");
const userService = require("../../services/users");
const debug = require('debug')('backend:api:users');


exports.getMe = (req, res, next) => {
    var id = req.user._id;
    debug('Fetching user with id:', id);
    users.findOne({"_id": id}).then( data => {
        if (data == null) { 
            debug('No user found with id:', id);
            return res.status(404).json({message: 'no user with that id'}); 
        }
        debug('User found:', data);
        return res.status(200).json(data.front);
    }).catch( err => { 
        debug('Error occurred while fetching user:', err);
        if (err) return next(err);
    });
};
