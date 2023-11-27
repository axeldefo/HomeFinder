var express = require('express');
var router = express.Router();
var usersRouter = require('./users');
var dpeRouter = require('./dpe');
var authRouter = require('./auth');

 router.use('/auth', authRouter);
router.use('/dpe', dpeRouter);
router.use('/users', usersRouter);


/* GET home page. 
router.get('api/v1/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

module.exports = router;
