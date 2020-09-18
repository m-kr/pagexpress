const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getPageTemplates,
  createPageTemplate,
  updatePageTemplate,
  deletePageTemplate,
} = require('../controllers/page-templates-controller');

router.get('/page-templates/:pageTemplateId?', auth, getPageTemplates);
router.post('/page-templates', auth, createPageTemplate);
router.put('/page-templates/:pageTemplateId', auth, updatePageTemplate);
router.delete('/page-templates/:pageTemplateId', auth, deletePageTemplate);

module.exports = router;
