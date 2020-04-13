const { FieldType } = require('../models');

const getFieldTypes = async (req, res) => {
  const { fieldTypeId } = req.params;

  try {
    if (fieldTypeId) {
      const fieldType = await Field.findById(fieldId);
      res.send(fieldType);
    }

    const fieldTypes = await FieldType.find().exec()
    res.send(fieldTypes);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createFieldType = async (req, res) => {
  try {
    const fieldType = new FieldType(req.body)
    fieldType.save();
    res.send(fieldType._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateFieldType = async (req, res) => {
  try {
    const fieldType = Field.findOneAndUpdate({_id: req.params.fieldTypeId}, req.body)
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
