const { Definition, definitionValidationSchema } = require('../models/Definition');
const { BadRequest, NotFound } = require('../utils/errors');

const getDefinitions = async (req, res, next) => {
  const { definitionId } = req.params;

  try {
    const query = definitionId ? Definition.findById(definitionId) : Definition.find();
    const data = await query.exec();

    if (definitionId && !data) {
      throw new NotFound('Definition not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createDefinition = async (req, res, next) => {
  const { error } = definitionValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const definition = new Definition(req.body);
    await definition.save();
    res.send(definition._id);
  } catch (err) {
    next(err);
  }
};

const updateDefinition = async (req, res, next) => {
  const { error } = definitionValidationSchema.validate(req.body);
  const { definitionId } = req.params;

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const definition = await Definition.findOneAndUpdate({ _id: definitionId }, req.body);
    res.json(definition);
  } catch (err) {
    next(err);
  }
};

const deleteDefinition = async (req, res, next) => {
  const { definitionId } = req.params;

  try {
    await Definition.findByIdAndRemove(definitionId);
    res.send(definitionId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDefinitions,
  createDefinition,
  updateDefinition,
  deleteDefinition,
};
