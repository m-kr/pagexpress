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

const pageTypeAttributeTypeSchema = new Schema({
  type: String,
});

const pageTypeAttributeSchema = new Schema({
  name: String,
  description: String,
  typeId: { type: Schema.Types.ObjectId, ref: 'PageAttributeType' },
});

const pageTypeSchema = new Schema({
  type: String,
  attributes: [pageTypeAttributeSchema],
});

const pageComponent = new Schema({
  _id: { type: String, default: uuid.v4 },
  componentType: { type: Schema.Types.ObjectId, ref: 'Component' },
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
    components: [pageComponent],
    pageType: { type: Schema.Types.ObjectId, ref: 'PageType' },
    pageTypeAttributes: Object,
  },
  {
    timestamps: true,
  }
);

const userSchema = Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const PageAttributeType = model('PageAttributeType', pageTypeAttributeTypeSchema);
const PageType = model('PageType', pageTypeSchema);
const FieldType = model('FieldType', fieldTypeSchema);
const Page = model('Page', pageSchema);
const Component = model('Component', componentSchema);
const User = model('User', userSchema);

module.exports = {
  FieldType,
  PageAttributeType,
  PageType,
  Page,
  Component,
  User,
};
