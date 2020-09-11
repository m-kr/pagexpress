const auth = require('./auth-routes');
const componentPatterns = require('./component-patterns-routes');
const countries = require('./countries-routes');
const pageDetails = require('./page-details-routes');
const fields = require('./fields-routes');
const pageAttributeTypes = require('./page-attribute-types-routes');
const pageTemplates = require('./page-templates-routes');
const pageTypes = require('./page-types-routes');
const pages = require('./pages-routes');
const users = require('./users-routes');

module.exports = {
  auth,
  componentPatterns,
  countries,
  pageDetails,
  fields,
  pageAttributeTypes,
  pageTemplates,
  pageTypes,
  pages,
  users,
};
