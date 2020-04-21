const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const fieldSchema = new Schema({
  name: { type: String, require: true, min: 3, max: 30 },
  fieldTypeId: { type: Schema.Types.ObjectId, ref: 'FieldType', require: true },
});

const fieldTypeSchema = new Schema({
  type: { type: String, require: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
});

const fieldValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  fieldTypeId: Joi.objectId().required(),
});

const fieldTypeValidationSchema = Joi.object({
  type: Joi.string().required().min(3).max(30),
  description: Joi.string().min(10).max(250),
});

const FieldType = model('FieldType', fieldTypeSchema);

module.exports = {
  fieldTypeSchema,
  fieldSchema,
  FieldType,
  fieldTypeValidationSchema,
  fieldValidationSchema,
};
