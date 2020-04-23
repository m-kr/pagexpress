const auth = require('./auth-routes');
const components = require('./components-routes');
const fields = require('./fields-routes');
const pageAttributeTypes = require('./page-attribute-types-routes');
const pageTypes = require('./page-types-routes');
const pages = require('./pages-routes');
const users = require('./users-routes');

module.exports = {
  auth,
  components,
  fields,
  pageAttributeTypes,
  pageTypes,
  pages,
  users,
};
