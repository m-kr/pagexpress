const { SiteInfo, siteInfoValidationSchema } = require('../models/SiteInfo');
const { BadRequest } = require('../utils/errors');

const getSiteInfo = async (req, res, next) => {
  try {
    let siteInfo = await SiteInfo.findOne().exec();

    if (!siteInfo) {
      siteInfo = new SiteInfo({ url: '' });
      await siteInfo.save();
    }

    res.json(siteInfo);
  } catch (err) {
    next(err);
  }
};

const createSiteInfo = async (req, res, next) => {
  const { error } = siteInfoValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const siteInfo = new SiteInfo(req.body);

    siteInfo.save();
    res.send(siteInfo._id);
  } catch (err) {
    next(err);
  }
};

const updateSiteInfo = async (req, res, next) => {
  const { error } = siteInfoValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const siteInfo = await SiteInfo.findOne();

    for (const [key, value] of Object.entries(req.body)) {
      siteInfo[key] = value;
    }

    await siteInfo.save();
    res.json(siteInfo);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSiteInfo,
  createSiteInfo,
  updateSiteInfo,
};
