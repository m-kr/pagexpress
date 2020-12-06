const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const {
  getPageDetails,
  createPageDetails,
  updatePageDetails,
  deletePageDetails,
} = require('../controllers/page-details-controller');

router.get('/page-details/:pageDetailsId?', auth, grandAccess('readAny', 'pageDetails'), getPageDetails);
router.post('/page-details', auth, grandAccess('readAny', 'pageDetails'), createPageDetails);
router.put('/page-details/:pageDetailsId', auth, grandAccess('readAny', 'pageDetails'), updatePageDetails);
router.delete('/page-details/:pageDetailsId', auth, grandAccess('readAny', 'pageDetails'), deletePageDetails);

module.exports = router;
