const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const { getPageStructure } = require('../controllers/page-structure-controller');

router.get('/page-structure/:pageId', auth, grandAccess('readAny', 'pageDetails'), getPageStructure);

module.exports = router;
