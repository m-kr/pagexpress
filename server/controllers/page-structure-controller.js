const { Page } = require('../models/Page');
const { ComponentPattern } = require('../models/ComponentPattern');
const { buildPageStructure } = require('../utils/page-structure');
const R = require('ramda');

const getPageStructure = async (req, res) => {
  const { pageId } = req.params;

  try {
    const pageData = await Page.findById(pageId)
      .select('name url pageDetails attributes')
      .populate({
        path: 'pageDetails',
        model: 'PageDetails',
        select: 'name country default title description components',
        populate: {
          path: 'country',
          select: 'name code language -_id',
        },
      })
      .populate({
        path: 'type',
        select: 'name -_id',
      })
      .exec();

    if (!pageData) {
      res.status(401).send(`Page with ID ${pageId} doesn't exist`);

      return;
    }

    const componentPatterns = await ComponentPattern.find().exec();
    const fullPageData = pageData.toObject();

    const pageVariants = fullPageData.pageDetails.map(details => {
      return {
        ...details,
        components: buildPageStructure(details.components, componentPatterns),
      };
    });

    const pageVariantsSelectedData = {
      ...R.pick(['attributes', 'name', 'url', 'type'], fullPageData),
      variants: pageVariants.map(variant => {
        return {
          ...R.pick(['name', 'country', 'title', 'description'], variant),
          components: variant.components.map(({ name, data, components }) => ({ name, data, components })),
        };
      }),
    };

    res.send(pageVariantsSelectedData);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageStructure,
};
