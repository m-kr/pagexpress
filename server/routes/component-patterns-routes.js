const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getComponentPatterns,
  createComponentPattern,
  updateComponentPattern,
  deleteComponentPattern,
} = require('../controllers/component-patterns-controller');

router.get('/component-patterns/:componentPatternId?', auth, getComponentPatterns);
router.post('/component-patterns', auth, createComponentPattern);
router.put('/component-patterns/:componentPatternId', auth, updateComponentPattern);
router.delete('/component-patterns/:componentPatternId', auth, deleteComponentPattern);

module.exports = router;
