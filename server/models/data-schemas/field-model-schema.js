const { Schema } = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const FieldModelSchema = () => ({
  name: { type: String, require: true, min: 3, max: 30 },
  label: { type: String, require: true, min: 3, max: 30 },
  description: { type: String, min: 5, max: 100 },
  required: { type: Boolean, default: false },
  defaultValue: { type: Schema.Types.Mixed, default: undefined },
  fieldTypeId: { type: Schema.Types.ObjectId, ref: 'FieldType', require: true },
  definedOptionsId: { type: Schema.Types.ObjectId, ref: 'Definition' },
  options: { type: Array, min: 1, default: null },
});

const fieldValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  label: Joi.string().required().min(3).max(30),
  description: Joi.string().min(5).max(100),
  required: Joi.boolean(),
  fieldTypeId: Joi.objectId().required(),
  definedOptionsId: Joi.objectId(),
  options: Joi.array().min(1),
});

module.exports = {
  FieldModelSchema,
  fieldValidationSchema,
};
