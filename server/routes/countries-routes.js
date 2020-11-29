const router = require('express').Router();
const { auth, grandAccess } = require('../middleware');
const { getCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countries-controller');

router.get('/countries/:countryId?', auth, grandAccess('readAny', 'country'), getCountries);
router.post('/countries', auth, grandAccess('createOwn', 'country'), createCountry);
router.put('/countries/:countryId', auth, grandAccess('updateAny', 'country'), updateCountry);
router.delete('/countries/:countryId', auth, grandAccess('deleteAny', 'country'), deleteCountry);

module.exports = router;
