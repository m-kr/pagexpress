const router = require('express').Router();
const { auth, grandAccess } = require('../middleware');
const {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
} = require('../controllers/field-types-controller');

router.get('/field-types/:fieldTypeId?', auth, grandAccess('readAny', 'fieldType'), getFieldTypes);
router.post('/field-types/', auth, grandAccess('createOwn', 'fieldType'), createFieldType);
router.put('/field-types/:fieldTypeId', auth, grandAccess('updateAny', 'fieldType'), updateFieldType);
router.delete('/field-types/:fieldTypeId', auth, grandAccess('deleteAny', 'fieldType'), deleteFieldType);

module.exports = router;
