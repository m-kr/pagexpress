const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
} = require('../controllers/components-controller');

router.get('/components/:componentId?', auth, getComponents);
router.post('/components', auth, createComponent);
router.put('/components/:componentId', auth, updateComponent);
router.delete('/components/:componentId', auth, deleteComponent);

module.exports = router;
