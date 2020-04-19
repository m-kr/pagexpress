const { Schema, model } = require('mongoose');

const pageTypeAttributeSchema = new Schema({
  name: { type: String, require: true, unique: true, min: 3, max: 30 },
  description: { type: String, min: 10, max: 250 },
  typeId: { type: Schema.Types.ObjectId, ref: 'PageAttributeType' },
});

const pageTypeSchema = new Schema({
  type: { type: String, require: true, unique: true, min: 3, max: 30 },
  attributes: [pageTypeAttributeSchema],
});

const PageType = model('PageType', pageTypeSchema);

module.exports = {
  pageTypeAttributeSchema,
  pageTypeSchema,
  PageType,
};
