const { Page, pageValidationSchema } = require('../models/Page');
const { PageType } = require('../models/PageType');
const ListFeatures = require('../utils/ListFeatures');
const { BadRequest, NotFound } = require('../utils/errors');

const getPages = async (req, res, next) => {
  const { pageId } = req.params;

  try {
    if (pageId) {
      const singlePage = await Page.findById(pageId)
        .select('name url pageDetails type attributes')
        .populate({
          path: 'pageDetails',
          model: 'PageDetails',
          select: 'name country title description',
        })
        .exec();

      if (!singlePage) {
        throw new NotFound('Page not exist');
      }

      const { type } = singlePage.toObject();
      const pageType = await PageType.findById(type).populate('attributes.type').exec();
      const pageTypeData = pageType.toObject();
      const pageTypeAttributesSchema = pageTypeData.attributes.map(attribute => ({
        ...attribute,
        type: attribute.type.type,
      }));

      res.json({
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
        .select('-attributes')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .exec();

      res.json({
        currentPage,
        totalPages,
        itemsPerPage,
        data: pages,
      });
    }
  } catch (err) {
    next(err);
  }
};

const createPage = async (req, res, next) => {
  const { error } = pageValidationSchema.validate(req.body);

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const page = new Page(req.body);
    await page.save();
    res.send(page._id);
  } catch (err) {
    next(err);
  }
};

const updatePage = async (req, res, next) => {
  const { error } = pageValidationSchema.validate(req.body);
  const { pageId } = req.params;

  try {
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const page = await Page.findOneAndUpdate({ _id: pageId }, req.body);
    res.json(page);
  } catch (err) {
    next(err);
  }
};

const deletePage = async (req, res, next) => {
  const { pageId } = req.params;

  try {
    await Page.findByIdAndRemove(pageId);
    res.send(pageId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPages,
  createPage,
  updatePage,
  deletePage,
};
