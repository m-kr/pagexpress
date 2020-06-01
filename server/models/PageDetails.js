const { Schema, model } = require('mongoose');
const uuid = require('uuid');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const pageComponentSchema = new Schema({
  _id: { type: String, unique: true, min: 36, max: 36, default: uuid.v4 },
  componentPatternId: { type: Schema.Types.ObjectId, required: true, ref: 'ComponentPattern' },
  parentComponentId: { type: String, min: 36, max: 36 },
  data: { type: Object },
  order: { type: Number, min: 0 },
  attributes: { type: Object },
});

const pageDetailsSchema = new Schema(
  {
    name: { type: String, require: true, min: 3, max: 50, default: 'default' },
    pageId: { type: Schema.Types.ObjectId, require: true, ref: 'Page' },
    country: { type: Schema.Types.ObjectId, require: true, ref: 'Country' },
    title: { type: String, require: true, min: 10, max: 60 },
    description: { type: String, require: true, max: 160 },
    components: [pageComponentSchema],
  },
  {
    timestamps: true,
  }
);

const pageComponentValidationSchema = Joi.object({
  _id: Joi.string().min(36).max(36),
  componentPatternId: Joi.objectId().required(),
  parentComponentId: Joi.string().min(36).max(36),
  data: Joi.object(),
  order: Joi.number().min(0),
  attributes: Joi.object(),
});

const pageDetailsValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  pageId: Joi.objectId().required(),
  country: Joi.objectId().required(),
  title: Joi.string().required().min(10).max(60),
  description: Joi.string().required().max(160),
  components: Joi.array().items(pageComponentValidationSchema),
  attributes: Joi.object(),
});

const PageDetails = model('PageDetails', pageDetailsSchema);

module.exports = {
  pageComponentSchema,
  pageDetailsSchema,
  pageComponentValidationSchema,
  pageDetailsValidationSchema,
  PageDetails,
};
