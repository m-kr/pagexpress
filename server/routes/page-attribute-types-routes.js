const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getPageAttributeTypes,
  createPageAttributeType,
  updatePageAttributeType,
  deletePageAttributeType,
} = require('../controllers/page-attribute-types-controller');

router.get('/page-attribute-types/:pageAttributeTypeId?', auth, getPageAttributeTypes);
router.post('/page-attribute-types', auth, createPageAttributeType);
router.put('/page-attribute-types/:pageAttributeTypeId', auth, updatePageAttributeType);
router.delete('/page-attribute-types/:pageAttributeTypeId', auth, deletePageAttributeType);

module.exports = router;
