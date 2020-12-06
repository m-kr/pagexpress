const _ = require('lodash');
const { PageDetails, pageDetailsValidationSchema } = require('../models/PageDetails');
const { Page } = require('../models/Page');
const { BadRequest, NotFound } = require('../utils/errors');

const hasComponentsUniqueIds = components => {
  if (!(components && components.length)) {
    return true;
  }

  return _.uniqBy(components, component => component._id);
};

const getPageDetails = async (req, res, next) => {
  const { pageDetailsId } = req.params;

  try {
    if (pageDetailsId) {
      const singlePageDetails = await PageDetails.findById(pageDetailsId);

      if (!singlePageDetails) {
        throw new NotFound(`There is no page details with id: ${pageDetailsId}`);
      }

      res.json(singlePageDetails);
    } else {
      const query = req.body.pageId ? { pageId: req.body.pageId } : {};
      const pageDetails = await PageDetails.find(query)
        .populate({
          path: 'country',
          select: 'name code',
        })
        .exec();

      res.json(pageDetails);
    }
  } catch (err) {
    next(err);
  }
};

const createPageDetails = async (req, res, next) => {
  const { error } = pageDetailsValidationSchema.validate(req.body);

  try {
    const page = await Page.findById(req.body.pageId);

    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    if (!page) {
      throw new BadRequest('Page not exist');
    }

    if (req.body.components) {
      const uniqueComponents = hasComponentsUniqueIds(req.body.components);

      if (!uniqueComponents) {
        throw new BadRequest('componentId is not unique');
      }
    }

    if (req.body.default === true) {
      await PageDetails.updateMany({ pageId: req.body.pageId }, { default: false });
    }

    const pageDetails = new PageDetails(req.body);
    page.pageDetails.push(pageDetails);

    await pageDetails.save();
    await Page.findOneAndUpdate({ _id: pageDetails.pageId }, { $push: { pageDetails: pageDetails } });
    res.send(pageDetails._id);
  } catch (err) {
    next(err);
  }
};

const updatePageDetails = async (req, res, next) => {
  const { error } = pageDetailsValidationSchema.validate(req.body);
  const { pageDetailsId } = req.params;

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const uniqueComponents = hasComponentsUniqueIds(req.body.components);

    if (!uniqueComponents) {
      throw new BadRequest('Component Id is not unique');
    }

    if (req.body.default === true) {
      await PageDetails.updateMany({ pageId: req.body.pageId }, { default: false });
    }

    const pageDetails = await PageDetails.findOneAndUpdate({ _id: pageDetailsId }, req.body);
    res.json(pageDetails);
  } catch (err) {
    next(err);
  }
};

const deletePageDetails = async (req, res, next) => {
  const { pageDetailsId } = req.params;

  try {
    await PageDetails.findByIdAndRemove(pageDetailsId);
    res.send(pageDetailsId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageDetails,
  createPageDetails,
  updatePageDetails,
  deletePageDetails,
};
