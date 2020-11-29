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

module.exports = app => {
  app.use('/v1', auth);
  app.use('/v1', componentPatterns);
  app.use('/v1', countries);
  app.use('/v1', fields);
  app.use('/v1', menu);
  app.use('/v1', pageAttributeTypes);
  app.use('/v1', pageDetails);
  app.use('/v1', pageStructure);
  app.use('/v1', pageTemplates);
  app.use('/v1', pageTypes);
  app.use('/v1', pages);
  app.use('/v1', users);
};
