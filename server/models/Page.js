const { Schema, model } = require('mongoose');
const uuid = require('uuid');

const pageComponentSchema = new Schema({
  _id: { type: String, unique: true, default: uuid.v4 },
  componentType: { type: Schema.Types.ObjectId, ref: 'Component' },
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

const Page = model('Page', pageSchema);

module.exports = {
  pageComponentSchema,
  pageSchema,
  Page,
};
