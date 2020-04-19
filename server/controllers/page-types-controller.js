const { PageType } = require('../models/PageType');

const getPageTypes = async (req, res) => {
  const { pageTypeId } = req.params;

  try {
    const query = (await pageTypeId) ? PageType.findById(pageTypeId) : PageType.find();
    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPageType = async (req, res) => {
  try {
    const pageType = new PageType(req.body);
    pageType.save();
    res.send(pageType._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePageType = async (req, res) => {
  const { pageTypeId } = req.params;

  try {
    const pageType = await PageType.findOneAndUpdate({ _id: pageTypeId }, req.body);
    res.send(pageType);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePageType = async (req, res) => {
  const { pageTypeId } = req.params;

  try {
    await PageType.findByIdAndRemove(pageTypeId);
    res.send(pageTypeId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
};
