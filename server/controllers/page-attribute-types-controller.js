const { PageAttributeType, pageTypeAttributeValidationSchema } = require('../models/PageAttributeType');
const { BadRequest, NotFound } = require('../utils/errors');

const getPageAttributeTypes = async (req, res, next) => {
  const { pageAttributeTypeId } = req.params;

  try {
    const query = pageAttributeTypeId ? PageAttributeType.findById(pageAttributeTypeId) : PageAttributeType.find();
    const data = await query.exec();

    if (pageAttributeTypeId && !data) {
      throw new NotFound('Page attribute not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createPageAttributeType = async (req, res, next) => {
  const { error } = pageTypeAttributeValidationSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  const existedAttributeWithName = await PageAttributeType.findOne({ name: req.body.type });

  if (existedAttributeWithName) {
    throw BadRequest(`Attribute "${req.body.type}" already exists`);
  }

  try {
    const pageAttributeType = new PageAttributeType(req.body);
    await pageAttributeType.save();
    res.send(pageAttributeType._id);
  } catch (err) {
    next(err);
  }
};

const updatePageAttributeType = async (req, res, next) => {
  const { error } = pageTypeAttributeValidationSchema.validate(req.body);
  const { pageAttributeTypeId } = req.params;

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  try {
    const pageAttributeType = await PageAttributeType.findOneAndUpdate({ _id: pageAttributeTypeId }, req.body);
    res.json(pageAttributeType);
  } catch (err) {
    next(err);
  }
};

const deletePageAttributeType = async (req, res, next) => {
  const { pageAttributeTypeId } = req.params;

  try {
    await PageAttributeType.findByIdAndRemove(pageAttributeTypeId);
    res.send(pageAttributeTypeId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageAttributeTypes,
  createPageAttributeType,
  updatePageAttributeType,
  deletePageAttributeType,
};
