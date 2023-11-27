var express = require('express');
var router = express.Router();
var userControler = require('../controllers/users')
var authWithToken = require('../middlewares/authWithToken')

/* GET my user info. */
//router.get('/me', authWithToken, userControler.getMe);


module.exports = router;
