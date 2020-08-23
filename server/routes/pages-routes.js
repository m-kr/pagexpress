const router = require('express').Router();
const auth = require('../middleware/auth');
const { getPageStructure, getPages, createPage, updatePage, deletePage } = require('../controllers/pages-controller');

router.get('/pages/:pageId?', auth, getPages);
router.get('/page-structure/:pageId', getPageStructure);
router.post('/pages', auth, createPage);
router.put('/pages/:pageId', auth, updatePage);
router.delete('/pages/:pageId', auth, deletePage);

module.exports = router;
