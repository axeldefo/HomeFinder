const jwt = require('jsonwebtoken');
const users = require('../models/users');
const bcrypt = require('bcrypt');
var debug = require('debug')('Authentication:');
require('dotenv').config();

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
exports.authenticateUser = async (email, password) => {
  try {
    debug('Checking if user exists');
    const user = await users.findOne({ email });

    if (!user) {
      debug('User not found');
      return { status: 401, data: { error: 'Invalid username or password' } };
    }

    debug('Checking the password');
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      debug('Invalid username or password');
      return { status: 401, data: { error: 'Invalid username or password' } };
    }

    debug('Creating and sending JWT access token');
    const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_SECRET, { expiresIn: '10m' });

    debug('Creating and sending JWT refresh token');
    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_SECRET, { expiresIn: '1h' });

    return { status: 200, data: { accessToken, refreshToken } };
  } catch (error) {
    debug('Login failed:', error);
    return { status: 500, data: { error: 'Login failed' } };
  }
};

// Service pour le rafraîchissement du token
exports.refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      debug('Refresh token missing');
      return { status: 400, data: { error: 'Refresh token is required' } };
    }

    debug('Verifying refresh token')
    ;
    const user = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
          debug('Invalid refresh token');
          reject(err);
        } else {
          resolve(user);
        }
      });
    });

    debug('Creating new access token');
    const newAccessToken = jwt.sign({ email: user.email }, process.env.ACCESS_SECRET, { expiresIn: '3m' });

    return { status: 200, data: { accessToken: newAccessToken } };
  } catch (error) {
    debug('Refresh token failed:', error);
    return { status: 500, data: { error: 'Refresh token failed' } };
  }
};
