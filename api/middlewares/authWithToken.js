'use strict';


const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    // on recupère le token du header : 'Authorization: Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1]
  
    // on vérifie que le token est bien présent sinon on retourne un 401
    if (token == null) return res.sendStatus(401)
  
    // on vérifie que le token est bien valide sinon on retourne un 401
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401)
      }
      // on récupère le payload qui contient l'id de l'utilisateur authentifié
      req.user = user;
      next();
    });
  }
  module.exports = authenticateToken;