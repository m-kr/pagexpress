const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
} = require('../controllers/field-types-controller');

router.get('/field-types/:fieldTypeId?', auth, getFieldTypes);
router.post('/field-types/', auth, createFieldType);
router.put('/field-types/:fieldTypeId', auth, updateFieldType);
router.delete('/field-types/:fieldTypeId', auth, deleteFieldType);

module.exports = router;
