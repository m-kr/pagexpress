const router = require('express').Router();
const {
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
} = require('../controllers/page-types-controller');

router.get('/page-types/:pageTypeId?', getPageTypes);
router.post('/page-types', createPageType);
router.put('/page-types/:pageTypeId', updatePageType);
router.delete('/page-types/:pageTypeId', deletePageType);

module.exports = router;
