const { Schema, model } = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const definitionValueSchema = new Schema(
  {
    default: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    value: { type: Schema.Types.Mixed, require: true },
    valueCategory: { type: String, default: undefined },
  },
  { _id: false }
);

const definitionSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  valueFieldType: { type: Schema.Types.ObjectId, require: true, ref: 'FieldType' },
  values: {
    default: [],
    type: [definitionValueSchema],
  },
});

const definitionValueValidationSchema = Joi.object({
  default: Joi.boolean(),
  name: Joi.string(),
  valueCategory: Joi.string(),
  value: Joi.alternatives().try(Joi.string(), Joi.array()),
});

const definitionValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  valueFieldType: Joi.objectId().required(),
  values: Joi.array().items(definitionValueValidationSchema),
});

const Definition = model('Definition', definitionSchema);

module.exports = {
  definitionSchema,
  Definition,
  definitionValueValidationSchema,
  definitionValidationSchema,
};
