const { Menu, menuValidationSchema } = require('../models/Menu');

const getMenus = async (req, res) => {
  const { menuId } = req.params;

  try {
    const query = (await menuId) ? Menu.findById(menuId) : Menu.find();
    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createMenu = async (req, res) => {
  const { error } = menuValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const menu = new Menu(req.body);
    menu.save();
    res.send(menu._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateMenu = async (req, res) => {
  const { error } = menuValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { menuId } = req.params;

  try {
    const menu = await Menu.findOneAndUpdate({ _id: menuId }, req.body);
    res.send(menu);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteMenu = async (req, res) => {
  const { menuId } = req.params;

  try {
    await Menu.findByIdAndRemove(menuId);
    res.send(menuId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
