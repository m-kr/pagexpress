const { Schema, model } = require('mongoose');
const {
  FieldsetModelSchema,
  fieldsetValidationSchema,
  ComponentPatternModelSchema,
  componentPatternValidationSchema,
} = require('./data-schemas');
const { fieldSchema } = require('./FieldType');

const fieldsetSchema = new Schema(FieldsetModelSchema({ fieldSchema }));
const componentPatternSchema = new Schema(ComponentPatternModelSchema({ fieldsetSchema, fieldSchema }));
const ComponentPattern = model('ComponentPattern', componentPatternSchema);

module.exports = {
  componentPatternSchema,
  ComponentPattern,
  fieldsetValidationSchema,
  componentPatternValidationSchema,
};
