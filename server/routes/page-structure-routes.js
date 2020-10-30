const router = require('express').Router();
const { getPageStructure } = require('../controllers/page-structure-controller');

router.get('/page-structure/:pageId', getPageStructure);

module.exports = router;
