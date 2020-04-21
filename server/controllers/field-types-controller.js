const { FieldType, fieldTypeValidationSchema } = require('../models/FieldType');

const getFieldTypes = async (req, res) => {
  const { fieldTypeId } = req.params;

  try {
    if (fieldTypeId) {
      const fieldType = await FieldType.findById(fieldTypeId);
      res.send(fieldType);
    }

    const fieldTypes = await FieldType.find().exec();
    res.send(fieldTypes);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createFieldType = async (req, res) => {
  const { error } = fieldTypeValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const fieldType = new FieldType(req.body);
    fieldType.save();
    res.send(fieldType._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateFieldType = async (req, res) => {
  const { error } = fieldTypeValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { fieldTypeId } = req.params;

  try {
    const fieldType = FieldType.findOneAndUpdate({ _id: fieldTypeId }, req.body);
    res.send(fieldType);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteFieldType = async (req, res) => {
  const { fieldTypeId } = req.params;

  try {
    await FieldType.findByIdAndRemove(fieldTypeId);
    res.send(fieldTypeId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
};
