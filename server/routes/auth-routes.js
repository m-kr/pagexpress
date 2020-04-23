const router = require('express').Router();
const auth = require('../controllers/auth-controller');

router.post('/', auth);

module.exports = router;
