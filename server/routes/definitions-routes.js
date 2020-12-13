const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const {
  getDefinitions,
  createDefinition,
  updateDefinition,
  deleteDefinition,
} = require('../controllers/definitions-controller');

router.get('/definitions/:definitionId?', auth, grandAccess('readAny', 'definition'), getDefinitions);
router.post('/definitions', auth, grandAccess('createOwn', 'definition'), createDefinition);
router.put('/definitions/:definitionId', auth, grandAccess('updateAny', 'definition'), updateDefinition);
router.delete('/definitions/:definitionId', auth, grandAccess('deleteAny', 'definition'), deleteDefinition);

module.exports = router;
