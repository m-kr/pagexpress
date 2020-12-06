const { Menu, menuValidationSchema } = require('../models/Menu');
const { BadRequest, NotFound } = require('../utils/errors');

const getMenus = async (req, res, next) => {
  const { menuId } = req.params;

  try {
    const query = menuId ? Menu.findById(menuId) : Menu.find();
    const data = await query.exec();

    if (menuId && !data) {
      throw new NotFound('Menu not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createMenu = async (req, res, next) => {
  const { error } = menuValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const menu = new Menu(req.body);
    await menu.save();
    res.send(menu._id);
  } catch (err) {
    next(err);
  }
};

const updateMenu = async (req, res, next) => {
  const { error } = menuValidationSchema.validate(req.body);
  const { menuId } = req.params;

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const menu = await Menu.findOneAndUpdate({ _id: menuId }, req.body);
    res.json(menu);
  } catch (err) {
    next(err);
  }
};

const deleteMenu = async (req, res, next) => {
  const { menuId } = req.params;

  try {
    await Menu.findByIdAndRemove(menuId);
    res.send(menuId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
