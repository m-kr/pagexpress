const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const {
  getPageTemplates,
  createPageTemplate,
  updatePageTemplate,
  deletePageTemplate,
} = require('../controllers/page-templates-controller');

router.get('/page-templates/:pageTemplateId?', auth, grandAccess('readAny', 'pageTemplate'), getPageTemplates);
router.post('/page-templates', auth, grandAccess('createOwn', 'pageTemplate'), createPageTemplate);
router.put('/page-templates/:pageTemplateId', auth, grandAccess('updateAny', 'pageTemplate'), updatePageTemplate);
router.delete('/page-templates/:pageTemplateId', auth, grandAccess('deleteAny', 'pageTemplate'), deletePageTemplate);

module.exports = router;
