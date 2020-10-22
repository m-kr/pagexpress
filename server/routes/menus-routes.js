const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../controllers/menus-controller');

router.get('/menus/:menuId?', auth, getMenus);
router.post('/menus/', auth, createMenu);
router.put('/menus/:menuId', auth, updateMenu);
router.delete('/menus/:menuId', auth, deleteMenu);

module.exports = router;
