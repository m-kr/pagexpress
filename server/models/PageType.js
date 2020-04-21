const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageTypeAttributeSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  pageTypeId: { type: Schema.Types.ObjectId, require: true, ref: 'PageAttributeType' },
});

const pageTypeSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  attributes: [pageTypeAttributeSchema],
});

const pageTypeAttributeValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  description: Joi.string().min(10).max(50),
  pageTypeId: Joi.objectId(),
});

const pageTypeValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  attributes: Joi.array().items(pageTypeAttributeValidationSchema),
});

const PageType = model('PageType', pageTypeSchema);

module.exports = {
  pageTypeAttributeSchema,
  pageTypeSchema,
  PageType,
  pageTypeAttributeValidationSchema,
  pageTypeValidationSchema,
};
