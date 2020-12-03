const { FieldType, fieldTypeValidationSchema } = require('../models/FieldType');
const { BadRequest, NotFound } = require('../utils/errors');

const getFieldTypes = async (req, res, next) => {
  const { fieldTypeId } = req.params;

  try {
    const query = fieldTypeId ? FieldType.findById(fieldTypeId) : FieldType.find();
    const data = await query.exec();

    if (fieldTypeId && !data) {
      throw new NotFound('Field type not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createFieldType = async (req, res, next) => {
  const { error } = fieldTypeValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const fieldType = new FieldType(req.body);

    fieldType.save();
    res.send(fieldType._id);
  } catch (err) {
    next(err);
  }
};

const updateFieldType = async (req, res, next) => {
  const { error } = fieldTypeValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { fieldTypeId } = req.params;
    const fieldType = FieldType.findOneAndUpdate({ _id: fieldTypeId }, req.body);
    res.json(fieldType);
  } catch (err) {
    next(err);
  }
};

const deleteFieldType = async (req, res, next) => {
  const { fieldTypeId } = req.params;

  try {
    await FieldType.findByIdAndRemove(fieldTypeId);
    res.send(fieldTypeId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
};
