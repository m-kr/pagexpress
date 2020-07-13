const { Schema, model } = require('mongoose');
const { fieldSchema, fieldValidationSchema } = require('./FieldType');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const fieldsetSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  fields: [fieldSchema],
});

const componentPatternSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  fields: [fieldSchema],
  fieldset: [fieldsetSchema],
});

const fieldsetValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  fields: Joi.array().items(fieldValidationSchema),
});

const componentPatternValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  description: Joi.string().min(10).max(250),
  fields: Joi.array().items(fieldValidationSchema),
  fieldset: Joi.array().items(fieldValidationSchema),
});

const ComponentPattern = model('ComponentPattern', componentPatternSchema);

module.exports = {
  componentPatternSchema,
  ComponentPattern,
  fieldsetValidationSchema,
  componentPatternValidationSchema,
};
