// Desc: Auth routes

var express = require('express');
var router = express.Router();
var authControler = require('../controllers/auth')


/* GET my user info. */
router.post('/register', authControler.register) ;
router.post('/login', authControler.login);
router.post('/refresh', authControler.refresh);

module.exports = router;
