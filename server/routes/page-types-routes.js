const router = require('express').Router();
const { auth, grandAccess } = require('../middleware');
const {
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
} = require('../controllers/page-types-controller');

router.get('/page-types/:pageTypeId?', auth, grandAccess('readAny', 'pageType'), getPageTypes);
router.post('/page-types', auth, grandAccess('createOwn', 'pageType'), createPageType);
router.put('/page-types/:pageTypeId', auth, grandAccess('updateAny', 'pageType'), updatePageType);
router.delete('/page-types/:pageTypeId', auth, grandAccess('deleteAny', 'pageType'), deletePageType);

module.exports = router;
