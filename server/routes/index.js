const auth = require('./auth-routes');
const componentPatterns = require('./component-patterns-routes');
const countries = require('./countries-routes');
const fields = require('./fields-routes');
const menu = require('./menus-routes');
const pageAttributeTypes = require('./page-attribute-types-routes');
const pageDetails = require('./page-details-routes');
const pageStructure = require('./page-structure-routes');
const pageTemplates = require('./page-templates-routes');
const pageTypes = require('./page-types-routes');
const pages = require('./pages-routes');
const users = require('./users-routes');

module.exports = {
  auth,
  componentPatterns,
  countries,
  fields,
  menu,
  pageAttributeTypes,
  pageDetails,
  pageStructure,
  pageTemplates,
  pageTypes,
  pages,
  users,
};
