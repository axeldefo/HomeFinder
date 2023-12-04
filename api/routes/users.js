// Description: User routes

var express = require('express');
var router = express.Router();
var userControler = require('../controllers/users')
var authWithToken = require('../middlewares/authWithToken')

/* GET my user info. */
router.get('/me', authWithToken, userControler.getMe);
router.get('/research', authWithToken, userControler.getAllSearchResults);
router.delete('/del/:id', authWithToken, userControler.deleteSearchResult);
router.get('/relaunch/:searchNumber', authWithToken, userControler.relaunchSearch);

module.exports = router;
