const router = require('express').Router();
const {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
} = require('../controllers/field-types-controller');

router.get('/field-types/:fieldTypeId?', getFieldTypes);
router.post('/field-types/', createFieldType);
router.put('/field-types/:fieldTypeId', updateFieldType);
router.delete('/field-types/:fieldTypeId', deleteFieldType);

module.exports = router;
