const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const pageTypeAttributeSchema = new Schema({
  type: { type: String, require: true, unique: true, min: 3, max: 30 },
});

const pageTypeAttributeValidationSchema = {
  type: Joi.string().required().min(3).max(30),
};

const validatePageTypeAttribute = pageTypeAttribute =>
  Joi.validate(pageTypeAttribute, pageTypeAttributeValidationSchema);
const PageAttributeType = model('PageAttributeType', pageTypeAttributeSchema);

module.exports = {
  pageTypeAttributeSchema,
  PageAttributeType,
  pageTypeAttributeValidationSchema,
  validatePageTypeAttribute,
};
