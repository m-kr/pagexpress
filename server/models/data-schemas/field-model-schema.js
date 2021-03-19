const { Schema } = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const FieldOptionModelSchema = () => ({
  name: { type: String, require: true, min: 3, max: 50 },
  value: { type: String, require: true, max: 50 },
});

const FieldModelSchema = () => ({
  name: { type: String, require: true, min: 3, max: 30 },
  label: { type: String, require: true, min: 3, max: 30 },
  description: { type: String, min: 5, max: 100 },
  required: { type: Boolean, default: false },
  defaultValue: { type: Schema.Types.Mixed, default: undefined },
  fieldTypeId: { type: Schema.Types.ObjectId, ref: 'FieldType', require: true },
  definedOptionsId: { type: Schema.Types.ObjectId, ref: 'Definition' },
  options: {
    type: [FieldOptionModelSchema()],
    default: null,
  },
});

// Prevent warning from client side - make it usable as isomorphic
/* eslint-disable */
const fieldOptionValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  value: Joi.string().required().max(50),
});

const fieldValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  label: Joi.string().required().min(3).max(30),
  description: Joi.string().min(5).max(100),
  required: Joi.boolean(),
  defaultValue: Joi.alternatives().try(Joi.string(), Joi.array(), Joi.object()),
  fieldTypeId: Joi.objectId().required(),
  definedOptionsId: Joi.objectId(),
  options: Joi.array().items(fieldOptionValidationSchema),
});
/* eslint-enable */

module.exports = {
  FieldModelSchema,
  FieldOptionModelSchema,
  fieldValidationSchema,
};
