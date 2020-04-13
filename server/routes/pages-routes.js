const router = require('express').Router()
const {
  getPages,
  getPageStructure,
  createPage,
  updatePage,
  deletePage,
} = require('../controllers/pages-controller');

router.get('/pages/:pageId?', getPages);
router.get('/page-structure/:pageId', getPageStructure);
router.post('/pages', createPage);
router.put('/pages/:pageId', updatePage);
router.delete('/pages/:pageId', deletePage);

module.exports = router;
