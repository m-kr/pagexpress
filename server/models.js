const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const fieldTypeSchema = new Schema({
  type: String,
  description: String,
});

const fieldSchema = new Schema({
  name: String,
  fieldTypeId: { type: Schema.Types.ObjectId, ref: 'FieldType' },
});

const subComponent = new Schema({
  componentId: { type: Schema.Types.ObjectId, ref: 'Component' },
  order: Number,
  single: Boolean,
});

const componentSchema = new Schema({
  name: String,
  description: String,
  fields: [fieldSchema],
  components: [subComponent],
});

const pageComponent = new Schema({
  _id: { type: String, default: uuid.v4 },
  component: { type: Schema.Types.ObjectId, ref: 'Component' },
  parentComponentId: String,
  data: Object,
  order: Number,
  attributes: Object,
});

const pageSchema = new Schema(
  {
    url: String,
    title: String,
    description: String,
    preloadedImages: Array,
    partner: String,
    components: [pageComponent],
  },
  {
    timestamps: true,
  }
);

const FieldType = model('FieldType', fieldTypeSchema);
const Page = model('Page', pageSchema);
const Component = model('Component', componentSchema);

module.exports = {
  FieldType,
  Page,
  Component,
};
