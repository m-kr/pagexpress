const { PageDetails, pageDetailsValidationSchema } = require('../models/PageDetails');
const { Page } = require('../models/Page');
const { buildPageDetailsStructure } = require('../utils/page-structure');

const hasComopnentsUniqueId = async components => {
  if (!(components && components.length)) {
    return true;
  }

  const componentsIds = components.map(component => component._id);
  const existedComponentWithTheSameId = await PageDetails.find({ 'components._id': { $in: componentsIds } });

  return !existedComponentWithTheSameId.length;
};

const getPageDetailsStructure = async (req, res) => {
  const { pageDetailsId } = req.params;

  try {
    const pageDetails = await PageDetails.findById(pageDetailsId)
      .populate({
        path: 'components.component',
        select: '_id name description',
      })
      .populate('pageDetails type attributes')
      .select('url description components');

    const structure = buildPageDetailsStructure(pageDetails.toObject().components);

    res.send(structure);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPageDetails = async (req, res) => {
  const { pageDetailsId } = req.params;

  try {
    if (pageDetailsId) {
      const singlePageDetails = await PageDetails.findById(pageDetailsId)
        .populate({
          path: 'country',
          select: 'name code',
        })
        .exec();

      if (!singlePageDetails) {
        return res.status(400).send(`There is no page details with id: ${pageDetailsId}`);
      }

      res.send(singlePageDetails);
    } else {
      const query = req.body.pageId ? { pageId: req.body.pageId } : {};
      const pageDetails = await PageDetails.find(query)
        .populate({
          path: 'country',
          select: 'name code',
        })
        .exec();

      res.send(pageDetails);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPageDetails = async (req, res) => {
  const { error } = pageDetailsValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const page = await Page.findById(req.body.pageId);

  if (!page) {
    return res.status(400).send('Page not exist');
  }

  if (req.body.components) {
    const uniqueComponents = await hasComopnentsUniqueId(req.body.components);

    if (!uniqueComponents) {
      return res.status(400).send('Component Id is not unique');
    }
  }

  try {
    const pageDetails = new PageDetails(req.body);
    page.pageDetails.push(pageDetails);
    await pageDetails.save();
    await Page.findOneAndUpdate({ _id: pageDetails.pageId }, { $push: { pageDetails: pageDetails } });
    res.send(pageDetails._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePageDetails = async (req, res) => {
  const { error } = pageDetailsValidationSchema.validate(req.body);
  const { pageDetailsId } = req.params;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const uniqueComponents = await hasComopnentsUniqueId(req.body.components);

  if (!uniqueComponents) {
    return res.status(400).send('Component Id is not unique');
  }

  try {
    const pageDetails = await PageDetails.findOneAndUpdate({ _id: pageDetailsId }, req.body);
    res.send(pageDetails);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePageDetails = async (req, res) => {
  const { pageDetailsId } = req.params;

  try {
    await PageDetails.findByIdAndRemove(pageDetailsId);
    res.send(pageDetailsId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageDetails,
  getPageDetailsStructure,
  createPageDetails,
  updatePageDetails,
  deletePageDetails,
};
