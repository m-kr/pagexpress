const { FieldModelSchema, fieldValidationSchema } = require('./field-model-schema');
const { FieldsetModelSchema, fieldsetValidationSchema } = require('./fieldset-model-schema');
const Joi = require('@hapi/joi');

const ComponentPatternModelSchema = ({ fieldSchema, fieldsetSchema } = {}) => ({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  label: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  fields: {
    type: [fieldSchema || FieldModelSchema()],
    default: undefined,
  },
  fieldset: {
    type: [fieldsetSchema || FieldsetModelSchema()],
    default: undefined,
  },
});

// Prevent warning from client side - make it usable as isomorphic
/* eslint-disable */
const componentPatternValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  label: Joi.string().required().min(3).max(30),
  description: Joi.string().min(10).max(250),
  fields: Joi.array().items(fieldValidationSchema),
  fieldset: Joi.array().items(fieldsetValidationSchema),
});
/* eslint-enable */

module.exports = {
  ComponentPatternModelSchema,
  componentPatternValidationSchema,
};
