const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');

const siteInfoSchema = new Schema({
  url: { type: String, require: true, max: 250 },
  previewUrl: { type: String, max: 250 },
  publishWebhookUrl: { type: String, max: 250 },
  imagesPath: { type: String, max: 250 },
});

const siteInfoValidationSchema = Joi.object({
  url: Joi.string().required().max(250),
  previewUrl: Joi.string().max(250),
  publishWebhookUrl: Joi.string().max(250),
  imagesPath: Joi.string().max(250),
});

const SiteInfo = model('SiteInfo', siteInfoSchema);

module.exports = {
  SiteInfo,
  siteInfoSchema,
  siteInfoValidationSchema,
};
