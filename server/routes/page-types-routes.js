const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
} = require('../controllers/page-types-controller');

router.get('/page-types/:pageTypeId?', auth, getPageTypes);
router.post('/page-types', auth, createPageType);
router.put('/page-types/:pageTypeId', auth, updatePageType);
router.delete('/page-types/:pageTypeId', auth, deletePageType);

module.exports = router;
