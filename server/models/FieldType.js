const { Schema, model } = require('mongoose');

const fieldTypeSchema = new Schema({
  type: { type: String, require: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
});

const fieldSchema = new Schema({
  name: { type: String, require: true, min: 3, max: 30 },
  fieldTypeId: { type: Schema.Types.ObjectId, ref: 'FieldType', require: true },
});

const FieldType = model('FieldType', fieldTypeSchema);

module.exports = {
  fieldTypeSchema,
  fieldSchema,
  FieldType,
};
