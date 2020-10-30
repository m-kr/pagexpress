const { Schema, model } = require('mongoose');
const uuid = require('uuid');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageComponentSchema = new Schema({
  _id: { type: String, min: 36, max: 36, default: uuid.v4 },
  attributes: { type: Object },
  componentPatternId: { type: Schema.Types.ObjectId, required: true, ref: 'ComponentPattern' },
  data: { type: Object },
  order: { type: Number, min: 0 },
  parentComponentId: { type: String, min: 36, max: 36 },
});

const pageDetailsSchema = new Schema(
  {
    components: [pageComponentSchema],
    country: { type: Schema.Types.ObjectId, require: true, ref: 'Country' },
    default: { type: Boolean, default: false },
    description: { type: String, require: true, max: 160 },
    name: { type: String, require: true, min: 3, max: 50, default: 'default' },
    pageId: { type: Schema.Types.ObjectId, require: true, ref: 'Page' },
    title: { type: String, require: true, min: 10, max: 60 },
  },
  {
    timestamps: true,
  }
);

const pageComponentValidationSchema = Joi.object({
  _id: Joi.string().min(36).max(36),
  attributes: Joi.object(),
  componentPatternId: Joi.objectId().required(),
  data: Joi.object(),
  order: Joi.number().min(0),
  parentComponentId: Joi.string().min(36).max(36),
});

const pageDetailsValidationSchema = Joi.object({
  attributes: Joi.object(),
  components: Joi.array().items(pageComponentValidationSchema),
  country: Joi.objectId().required(),
  default: Joi.boolean(),
  description: Joi.string().required().max(160),
  name: Joi.string().min(3).max(50).required(),
  pageId: Joi.objectId().required(),
  title: Joi.string().required().min(10).max(60),
});

const PageDetails = model('PageDetails', pageDetailsSchema);

module.exports = {
  pageComponentSchema,
  pageDetailsSchema,
  pageComponentValidationSchema,
  pageDetailsValidationSchema,
  PageDetails,
};
