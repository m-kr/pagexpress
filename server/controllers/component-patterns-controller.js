const { ComponentPattern, componentPatternValidationSchema } = require('../models/ComponentPattern');
const { BadRequest, NotFound } = require('../utils/errors');
const { normalizeComponentPattern } = require('../utils/normalizers');

const getComponentPatterns = async (req, res, next) => {
  const { componentPatternId } = req.params;

  try {
    const query = componentPatternId ? ComponentPattern.findById(componentPatternId) : ComponentPattern.find();
    await query
      .populate({
        path: 'fields.definedOptionsId fieldset.fields.definedOptionsId',
        model: 'Definition',
        select: 'values defaultValue -_id',
      })
      .populate({
        path: 'fields.fieldTypeId fieldset.fields.fieldTypeId',
        model: 'FieldType',
        select: 'type -_id',
      });

    const data = await query.exec();

    if (componentPatternId && !data) {
      throw new NotFound('Component pattern not exist');
    }

    const normalizedData = componentPatternId
      ? normalizeComponentPattern(data.toObject())
      : data.map(singleComponentData => normalizeComponentPattern(singleComponentData.toObject()));

    res.json(normalizedData);
  } catch (err) {
    next(err);
  }
};

const createComponentPattern = async (req, res, next) => {
  const { error } = componentPatternValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const componentPattern = new ComponentPattern(req.body);
    await componentPattern.save();
    res.send(componentPattern._id);
  } catch (err) {
    next(err);
  }
};

const updateComponentPattern = async (req, res, next) => {
  const { error } = componentPatternValidationSchema.validate(req.body);
  const { componentPatternId } = req.params;

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const componentPattern = await ComponentPattern.findOneAndUpdate({ _id: componentPatternId }, req.body);
    res.json(componentPattern);
  } catch (err) {
    next(err);
  }
};

const deleteComponentPattern = async (req, res, next) => {
  const { componentPatternId } = req.params;

  try {
    await ComponentPattern.findByIdAndRemove(componentPatternId);
    res.send(componentPatternId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getComponentPatterns,
  createComponentPattern,
  updateComponentPattern,
  deleteComponentPattern,
};
