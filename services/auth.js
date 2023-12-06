// Description: Service pour l'authentification

const jwt = require('jsonwebtoken');
const users = require('../models/users');
const bcrypt = require('bcrypt');
var debug = require('debug')('Authentication:');
const UserServices = require('./users');
require('dotenv').config();




function generateAccessToken  (user) {
  debug('generating access token : ', user.email);
  //jwt.sign with name, email  
  return jwt.sign({ name: user.name, email: user.email }, process.env.ACCESS_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken  (user) {
  debug('generating refresh token : ', user.email);
  return jwt.sign({ name: user.name, email: user.email  }, process.env.REFRESH_SECRET, { expiresIn: '1y' });
}

function authenticate  (password, user) {
  debug('authenticating user : ', user.email);
  return bcrypt.compareSync(password, user.password);
}

exports.generateAccessToken = generateAccessToken;

// Service pour l'inscription
exports.registerUser = async (name, email, password) => {
  try {
    debug('Checking if user exists');
    const existingUser = await users.findOne({ email });
    
    if (existingUser) {
      debug('User already exists');
      return { status: 400, data: { error: 'email already exists' } };
    }

    
    debug('Hashing the password');
   //gerneration du salt
   const salt = await bcrypt.genSalt(parseInt(process.env.ROUND) ?? 0);
    
   // Hasher le mot de passe
   debug('Hashing the password');
   const hashedPassword = await bcrypt.hash(password, salt);

    debug('Creating a new user');
    const newUser = new users({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    debug('User registered successfully');
    return { status: 201, data: { message: 'User registered successfully' } };
  } catch (error) {
    debug('Registration failed:', error);
    return { status: 500, data: { error: 'Registration failed' } };
  }
};

// Service pour la connexion
exports.login = async (email, password) => {
 try { 
    var user = await UserServices.getUser(email);

      if (user === undefined || !authenticate(password, user)) {
      throw new Error('Invalid credentials');
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new Error('invalid credentials');
    }
};


// Service pour le rafraîchissement du token
exports.refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    // Vérifier le token de rafraîchissement
    const user = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });

    // Créer un nouveau token d'accès
    const accessToken = generateAccessToken(user);
    return accessToken
    } catch (error) {
    }

};
