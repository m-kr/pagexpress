const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countries-controller');

router.get('/countries/:countryId?', auth, getCountries);
router.post('/countries', auth, createCountry);
router.put('/countries/:countryId', auth, updateCountry);
router.delete('/countries/:countryId', auth, deleteCountry);

module.exports = router;
