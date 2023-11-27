var express = require('express');
var router = express.Router();
var authControler = require('../controllers/auth')


/* GET my user info. */
router.post('/register', authControler.register);
router.get('/login', authControler.login);
router.get('/refresh', authControler.refresh);

module.exports = router;
