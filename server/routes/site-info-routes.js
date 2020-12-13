const router = require('express').Router();
const { auth, grandAccess } = require('../middlewares');
const { getSiteInfo, createSiteInfo, updateSiteInfo } = require('../controllers/site-info-controller');

router.get('/site-info', auth, grandAccess('readAny', 'siteInfo'), getSiteInfo);
router.post('/site-info', auth, grandAccess('createOwn', 'siteInfo'), createSiteInfo);
router.put('/site-info', auth, grandAccess('updateAny', 'siteInfo'), updateSiteInfo);

module.exports = router;
