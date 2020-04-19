const { Schema, model } = require('mongoose');
const uuid = require('uuid');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageComponentSchema = new Schema({
  _id: { type: String, unique: true, min: 36, max: 36, default: uuid.v4 },
  componentType: { type: Schema.Types.ObjectId, required: true, ref: 'Component' },
  parentComponentId: { type: String, min: 36, max: 36 },
  data: { type: Object },
  order: { type: Number, min: 0 },
  attributes: { type: Object },
});

const pageSchema = new Schema(
  {
    url: { type: String, require: true },
    title: { type: String, require: true, min: 10, max: 60 },
    description: { type: String, require: true, max: 160 },
    components: [pageComponentSchema],
    pageType: { type: Schema.Types.ObjectId, require: true, ref: 'PageType' },
    pageTypeAttributes: { type: Object },
  },
  {
    timestamps: true,
  }
);

const pageComponentValidationSchema = {
  _id: Joi.string().min(36).max(36),
  componentType: Joi.objectId().required(),
  parentComponentId: Joi.string().min(36).max(36),
  data: Joi.object(),
  order: Joi.number().min(0),
  attributes: Joi.object(),
};

const pageValidationSchema = {
  url: Joi.string().required(),
  title: Joi.string().required().min(10).max(60),
  description: Joi.string().required().max(160),
  components: Joi.array().items(Joi.object(pageComponentValidationSchema)),
  pageType: Joi.objectId().required(),
  pageTypeAttributes: Joi.object(),
};

const validatePageComponent = pageComponent => Joi.validate(pageComponent, pageComponentValidationSchema);
const validatePage = page => Joi.validate(page, pageValidationSchema);
const Page = model('Page', pageSchema);

module.exports = {
  pageComponentSchema,
  pageSchema,
  Page,
  pageComponentValidationSchema,
  pageValidationSchema,
  validatePage,
  validatePageComponent,
};
