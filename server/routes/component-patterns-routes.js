const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');

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
  auth,
  grandAccess('updateAny', 'componentPattern'),
  updateComponentPattern
);
router.delete(
  '/component-patterns/:componentPatternId',
  auth,
  grandAccess('deleteAny', 'componentPattern'),
  deleteComponentPattern
);

module.exports = router;
