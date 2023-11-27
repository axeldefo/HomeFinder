var express = require('express');
var router = express.Router();
var dpeControler = require('../controllers/dpe')

/* GET users listing. */
router.get('/', dpeControler.getAll);
router.get('/search', dpeControler.readDpe);
router.get('/geolocation', dpeControler.getGeolocation);

module.exports = router;