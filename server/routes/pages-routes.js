const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const { getPages, createPage, updatePage, deletePage } = require('../controllers/pages-controller');

router.get('/pages/:pageId?', auth, grandAccess('readAny', 'page'), getPages);
router.post('/pages', auth, grandAccess('createOwn', 'page'), createPage);
router.put('/pages/:pageId', auth, grandAccess('updateAny', 'page'), updatePage);
router.delete('/pages/:pageId', auth, grandAccess('deleteAny', 'page'), deletePage);

module.exports = router;
