'use strict';

const User = require('../models/users');
var crypto = require('crypto');
var debug = require('debug')('backend:services:users');


  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  function makeSalt() {
    return crypto.randomBytes(16).toString('base64');
  };

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  function encryptPassword(password,salt) {
    debug('encrypting password : ', password,' salt: ', salt);
    if (!password || !salt) return undefined;
    
    var salt = Buffer.from(salt, 'base64');
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha256')
      .toString('base64');
  };

  exports.authenticate = (plainText, user) =>{
    debug('checking password : ', plainText,' user: ', user);
    if (!plainText ||!user) return false;
    debug('encrypted : ', encryptPassword(plainText, user.salt),' user.password : ', user.password);
    return encryptPassword(plainText, user.salt) === user.password;
  },

exports.createUser =  async (user) => { 

    //vérifier la présence des données de l'utilisateur
    if (!user.name ||!user.email ||!user.password) {
        return Promise.reject(new Error('Missing required fields'))
    }
    //vérifier si l'utilisateur existe déjà.
    try {
        var existingUser  = await User.findOne({"email": user.email});
        if (existingUser) {
            debug('User already exists : ',existingUser?.name);
            throw new Error('User already exists')
        }
    } catch (error) {
        throw error;
    }

    //encodage du password: 
    var plainPassword = user.password;
    user.salt = makeSalt();
    var hashedPassword = encryptPassword(plainPassword,user.salt);
    if (!hashedPassword) {
        throw new Error('Cannot encrypt password');
    }
    user.password = hashedPassword;
    //vérifier les données du user puis l'ajouter en BDD.
    const newUser = new User(user);
    return newUser.save();
}

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
