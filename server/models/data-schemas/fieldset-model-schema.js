const { FieldModelSchema, fieldValidationSchema } = require('./field-model-schema');
const Joi = require('@hapi/joi');

const FieldsetModelSchema = ({ fieldSchema } = {}) => ({
  name: { type: String, require: true, min: 3, max: 30 },
  label: { type: String, require: true, min: 3, max: 30 },
  description: { type: String, min: 5, max: 100 },
  required: { type: Boolean, default: false },
  fields: [fieldSchema || FieldModelSchema()],
});

const fieldsetValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  label: Joi.string().required().min(3).max(30),
  description: Joi.string().min(5).max(100),
  required: Joi.boolean(),
  fields: Joi.array().items(fieldValidationSchema),
});

module.exports = {
  FieldsetModelSchema,
  fieldsetValidationSchema,
};
