const router = require('express').Router();
const auth = require('../middleware/auth');
const { getUsers, createUser, resetPassword, deleteUser } = require('../controllers/users-controller');

router.get('/users/:userId?', auth, getUsers);
router.post('/users', createUser);
router.put('/users/:userId', auth, resetPassword);
router.delete('/users/:userId', auth, deleteUser);

module.exports = router;
