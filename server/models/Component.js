const { Schema, model } = require('mongoose');
const { fieldSchema } = require('./FieldType');

const subComponentSchema = new Schema({
  componentId: { type: Schema.Types.ObjectId, ref: 'Component' },
  order: { type: Number, require: true, unique: true, min: 0 },
  single: { type: Boolean, default: false },
});

const componentSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  fields: [fieldSchema],
  components: [subComponentSchema],
});

const Component = model('Component', componentSchema);

module.exports = {
  subComponentSchema,
  componentSchema,
  Component,
};
