const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const pageTypeAttributeSchema = new Schema({
  name: { type: String, require: true, min: 3, max: 30 },
});

const pageTypeAttributeValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
});

const PageAttributeType = model('PageAttributeType', pageTypeAttributeSchema);

module.exports = {
  pageTypeAttributeSchema,
  PageAttributeType,
  pageTypeAttributeValidationSchema,
};
