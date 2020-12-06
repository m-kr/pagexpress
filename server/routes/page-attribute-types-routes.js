const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const {
  getPageAttributeTypes,
  createPageAttributeType,
  updatePageAttributeType,
  deletePageAttributeType,
} = require('../controllers/page-attribute-types-controller');

router.get(
  '/page-attribute-types/:pageAttributeTypeId?',
  auth,
  grandAccess('readAny', 'pageAttributeType'),
  getPageAttributeTypes
);
router.post('/page-attribute-types', auth, grandAccess('createOwn', 'pageAttributeType'), createPageAttributeType);
router.put(
  '/page-attribute-types/:pageAttributeTypeId',
  auth,
  grandAccess('updateAny', 'pageAttributeType'),
  updatePageAttributeType
);
router.delete(
  '/page-attribute-types/:pageAttributeTypeId',
  auth,
  grandAccess('deleteAny', 'pageAttributeType'),
  deletePageAttributeType
);

module.exports = router;
