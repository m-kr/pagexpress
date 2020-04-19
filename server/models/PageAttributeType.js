const { Schema, model } = require('mongoose');

const pageTypeAttributeTypeSchema = new Schema({
  type: { type: String, require: true, unique: true, min: 3, max: 30 },
});

const PageAttributeType = model('PageAttributeType', pageTypeAttributeTypeSchema);

module.exports = {
  pageTypeAttributeTypeSchema,
  PageAttributeType,
};
