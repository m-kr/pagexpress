const router = require('express').Router();
const {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} = require('../controllers/components-controller');

router.get('/components/:componentId?', getComponents);
router.post('/components', createComponent);
router.put('/components/:componentId', updateComponent);
router.delete('/components/:componentId', deleteComponent);

module.exports = router;
