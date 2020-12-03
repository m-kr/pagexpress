const { PageType, pageTypeValidationSchema } = require('../models/PageType');
const { BadRequest, NotFound } = require('../utils/errors');

const getPageTypes = async (req, res, next) => {
  const { pageTypeId } = req.params;

  try {
    const query = pageTypeId ? PageType.findById(pageTypeId) : PageType.find();
    const data = await query.exec();

    if (pageTypeId && !data) {
      throw new NotFound('Page type not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createPageType = async (req, res, next) => {
  const { error } = pageTypeValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const pageType = new PageType(req.body);
    await pageType.save();
    res.send(pageType._id);
  } catch (err) {
    next(err);
  }
};

const updatePageType = async (req, res, next) => {
  const { error } = pageTypeValidationSchema.validate(req.body);
  const { pageTypeId } = req.params;

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const pageType = await PageType.findOneAndUpdate({ _id: pageTypeId }, req.body);
    res.json(pageType);
  } catch (err) {
    next(err);
  }
};

const deletePageType = async (req, res, next) => {
  const { pageTypeId } = req.params;

  try {
    await PageType.findByIdAndRemove(pageTypeId);
    res.send(pageTypeId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
};
