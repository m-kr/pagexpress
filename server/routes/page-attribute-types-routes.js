const router = require('express').Router();
const {
  getPageAttributeTypes,
  createPageAttributeType,
  updatePageAttributeType,
  deletePageAttributeType,
} = require('../controllers/page-attribute-types-controller');

router.get('/page-attribute-types/:pageAttributeTypeId?', getPageAttributeTypes);
router.post('/page-attribute-types', createPageAttributeType);
router.put('/page-attribute-types/:pageAttributeTypeId', updatePageAttributeType);
router.delete('/page-attribute-types/:pageAttributeTypeId', deletePageAttributeType);

module.exports = router;
