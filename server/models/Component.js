const { Schema, model } = require('mongoose');
const { fieldSchema, fieldValidationSchema } = require('./FieldType');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const subComponentSchema = new Schema({
  componentId: { type: Schema.Types.ObjectId, require: true, ref: 'Component' },
  order: { type: Number, require: true, unique: true, min: 0 },
  single: { type: Boolean, default: false },
});

const componentSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  fields: [fieldSchema],
  components: [subComponentSchema],
});

const subComponentValidationSchema = {
  componentId: Joi.objectId().required(),
  order: Joi.number().required().min(0),
  single: Joi.boolean(),
};

const componentValidationSchema = {
  name: Joi.sctring().required().min(3).max(30),
  description: Joi.string().min(10).max(250),
  fields: Joi.array().items(Joi.object(fieldValidationSchema)),
  components: Joi.array().items(Joi.object(subComponentValidationSchema)),
};

const validateSubcomponent = subComponent => Joi.validate(subComponent, subComponentValidationSchema);
const validateComponent = component => Joi.validate(component, componentValidationSchema);
const Component = model('Component', componentSchema);

module.exports = {
  subComponentSchema,
  componentSchema,
  Component,
  componentValidationSchema,
  subComponentValidationSchema,
  validateComponent,
  validateSubcomponent,
};
