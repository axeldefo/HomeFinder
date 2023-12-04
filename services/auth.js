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
   // TODO: fetch le user depuis la db basé sur l'email passé en paramètre
   var user = await UserServices.getUser(email);
   if (user == undefined) {
       return res.status(401).send('invalid credentials');
   }
 
   // TODO: check que le mot de passe du user est correct
   if (!authenticate(password,user) ) {
       return res.status(401).send('invalid credentials');
   }
   const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken(user);
   return {
     accessToken,
     refreshToken
   };
};

// Service pour le rafraîchissement du token
exports.refreshToken = async (req,res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userFromToken) => {
    if (err) {
      return res.sendStatus(401)
    }

    // TODO: Check en base que l'user est toujours existant/autorisé à utiliser la plateforme
    var user = await UserServices.getUser(userFromToken.email);
    if (user == undefined) {
      return res.status(401).send('invalid credentials');
    }
    
    const refreshedToken = generateAccessToken(user.front);
    res.send({
      accessToken: refreshedToken,
    });
  });
  

};
