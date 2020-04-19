const { Page } = require('../models/Page');
const { buildPageStructure } = require('../utils/page-structure');

const getPageStructure = async (req, res) => {
  const { pageId } = req.params;

  try {
    const page = await Page.findById(pageId)
      .populate({
        path: 'components.component',
        select: '_id name description',
      })
      .populate('pageTypeAttributes')
      .select('_id url description components');

    const structure = buildPageStructure(page.toObject().components);

    res.send(structure);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPages = async (req, res) => {
  const { pageId } = req.params;

  try {
    const query = pageId ? Page.findById(pageId) : Page.find();

    const data = await query
      .populate({
        path: 'components.componentType',
        select: 'name description _id',
      })
      .populate('pageType')
      .exec();

    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPage = async (req, res) => {
  try {
    const page = new Page(req.body);
    page.save();
    res.send(page._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePage = async (req, res) => {
  const { pageId } = req.params;

  try {
    const page = await Page.findOneAndUpdate({ _id: pageId }, req.body);
    res.send(page);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePage = async (req, res) => {
  const { pageId } = req.params;

  try {
    await Page.findByIdAndRemove(pageId);
    res.send(pageId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPages,
  getPageStructure,
  createPage,
  updatePage,
  deletePage,
};
