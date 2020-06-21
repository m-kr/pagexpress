const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getPageDetails,
  createPageDetails,
  updatePageDetails,
  deletePageDetails,
} = require('../controllers/page-details-controller');

router.get('/page-details/:pageDetailsId?', auth, getPageDetails);
router.post('/page-details', auth, createPageDetails);
router.put('/page-details/:pageDetailsId', auth, updatePageDetails);
router.delete('/page-details/:pageDetailsId', auth, deletePageDetails);

module.exports = router;
