const router = require('express').Router();
const { auth, grandAccess } = require('../middleware');
const { authUser, getUsers, createUser, resetPassword, deleteUser } = require('../controllers/users-controller');

router.get('/users/me', auth, grandAccess('readOwn', 'user'), authUser);
router.get('/users/:userId?', auth, grandAccess('readAny', 'user'), getUsers);
router.post('/users', createUser);
router.put('/users/:userId', auth, grandAccess('updateAny', 'user'), resetPassword);
router.delete('/users/:userId', auth, grandAccess('deleteAny', 'user'), deleteUser);

module.exports = router;
