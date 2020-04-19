const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageTypeAttributeSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  typeId: { type: Schema.Types.ObjectId, require: true, ref: 'PageAttributeType' },
});

const pageTypeSchema = new Schema({
  type: { type: String, require: true, unique: true, min: 3, max: 30 },
  attributes: [pageTypeAttributeSchema],
});

const pageTypeAttributeValidationSchema = {
  name: Joi.string().required().min(3).max(30),
  description: Joi.string().min(10).max(50),
  typeId: Joi.objectId(),
};

const pageTypeValidationSchema = {
  type: Joi.string().min(3).max(30).required(),
  attributes: Joi.array().items(Joi.object(pageTypeAttributeValidationSchema)),
};

const validatePageTypeAttribute = pageTypeAttribute =>
  Joi.validate(pageTypeAttribute, pageTypeAttributeValidationSchema);
const validatePageType = pageType => Joi.validate(pageType, pageTypeValidationSchema);
const PageType = model('PageType', pageTypeSchema);

module.exports = {
  pageTypeAttributeSchema,
  pageTypeSchema,
  PageType,
  pageTypeAttributeValidationSchema,
  pageTypeValidationSchema,
  validatePageType,
  validatePageTypeAttribute,
};
