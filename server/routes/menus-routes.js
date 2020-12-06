const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const { getMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menus-controller');

router.get('/menus/:menuId?', auth, grandAccess('readAny', 'menu'), getMenus);
router.post('/menus/', auth, grandAccess('createOwn', 'menu'), createMenu);
router.put('/menus/:menuId', auth, grandAccess('', 'menu'), updateMenu);
router.delete('/menus/:menuId', auth, grandAccess('readAny', 'menu'), deleteMenu);

module.exports = router;
