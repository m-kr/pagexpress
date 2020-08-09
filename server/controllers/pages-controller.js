const { Page, pageValidationSchema } = require('../models/Page');
const { ComponentPattern } = require('../models/ComponentPattern');
const { PageType } = require('../models/PageType');
const ListFeatures = require('../utils/ListFeatures');
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
        select: 'name country title description components',
      })
      .populate({
        path: 'type',
        select: 'name',
      })
      .exec();

    const componentPatterns = await ComponentPattern.find().exec();
    const fullPageData = pageData.toObject();

    const pageStructure = fullPageData.pageDetails.map(details => {
      return {
        ...details,
        components: buildPageStructure(details.components, componentPatterns),
      };
    });

    res.send({
      ...R.pick(['name', 'url', 'attributes'], fullPageData),
      structure: pageStructure,
    });
    // res.send(fullPageData);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPages = async (req, res) => {
  const { pageId } = req.params;

  try {
    if (pageId) {
      const singlePage = await Page.findById(pageId)
        .select('name url pageDetails attributes')
        .populate({
          path: 'pageDetails',
          model: 'PageDetails',
          select: 'name country title description',
        })
        .populate({
          path: 'type',
          select: 'name',
        })
        .exec();

      if (!singlePage) {
        throw new Error('Page not exist');
      }

      const { type } = singlePage.toObject();
      const pageType = await PageType.findById(type).populate('attributes.type').exec();
      const pageTypeData = pageType.toObject();
      const pageTypeAttributesSchema = pageTypeData.attributes.map(attribute => ({
        ...attribute,
        type: attribute.type.name,
      }));

      res.send({
        pageType: pageTypeData.name,
        attributesSchema: pageTypeAttributesSchema,
        data: singlePage,
      });
    } else {
      const sortableFields = ['name', 'type', 'url', 'createdAt', 'updatedAt'];
      const listFeatures = new ListFeatures(Page, req.query, 'name');
      const { currentPage, itemsPerPage, limit, skip, totalPages } = await listFeatures.getPaginationParameters();
      const sortBy = listFeatures.getSort(sortableFields);
      const queryFilter = listFeatures.getQueryFilter();

      const pages = await Page.find(queryFilter)
        .populate({
          path: 'pageDetails',
          model: 'PageDetails',
          populate: {
            path: 'country',
            select: 'name code',
          },
        })
        .populate({
          path: 'type',
          select: 'name',
        })
        .select('name url type pageDetails')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .exec();

      res.send({
        currentPage,
        totalPages,
        itemsPerPage,
        data: pages,
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPage = async (req, res) => {
  const { error } = pageValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const page = new Page(req.body);
    await page.save();
    res.send(page._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePage = async (req, res) => {
  const { error } = pageValidationSchema.validate(req.body);
  const { pageId } = req.params;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const page = await Page.findOneAndUpdate({ _id: pageId }, req.body);
    res.send(page);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePage = async (req, res) => {
  const { pageId } = req.params;

  try {
    await Page.findByIdAndRemove(pageId);
    res.send(pageId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageStructure,
  getPages,
  createPage,
  updatePage,
  deletePage,
};
