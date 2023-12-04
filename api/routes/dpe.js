// Description: DPE routes

var express = require('express');
var router = express.Router();
var dpeControler = require('../controllers/dpe')
var authWithToken = require('../middlewares/authWithToken')


/* GET users listing. */
router.get('/',authWithToken, dpeControler.getAll);
router.get('/searchPlus',authWithToken, dpeControler.readDpePlus);
router.get('/search',authWithToken, dpeControler.readDpe);



router.get('/geolocationPlus', authWithToken, dpeControler.getGeolocationPlus);
router.get('/geolocation', authWithToken, dpeControler.getGeolocation);

router.get('/immonot', authWithToken, dpeControler.getDataFromSite);

module.exports = router;