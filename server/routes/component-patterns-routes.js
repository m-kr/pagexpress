const router = require('express').Router();
const { auth, grandAccess } = require('../middleware');

const {
  getComponentPatterns,
  createComponentPattern,
  updateComponentPattern,
  deleteComponentPattern,
} = require('../controllers/component-patterns-controller');

router.get(
  '/component-patterns/:componentPatternId?',
  auth,
  grandAccess('readAny', 'componentPattern'),
  getComponentPatterns
);
router.post('/component-patterns', auth, grandAccess('createOwn', 'componentPattern'), createComponentPattern);
router.put(
  '/component-patterns/:componentPatternId',
  grandAccess('updateAny', 'componentPattern'),
  auth,
  updateComponentPattern
);
router.delete(
  '/component-patterns/:componentPatternId',
  grandAccess('deleteAny', 'componentPattern'),
  auth,
  deleteComponentPattern
);

module.exports = router;
