const { Page, pageValidationSchema } = require('../models/Page');
const { buildPageStructure } = require('../utils/page-structure');

const hasComopnentsUniqueId = async components => {
  if (!(components && components.length)) {
    return true;
  }
  const componentsIds = components.map(component => component._id);
  const existedPageComponentWithTheSameId = await Page.find({ 'components._id': { $in: componentsIds } });

  return !existedPageComponentWithTheSameId.length;
};

const getPageStructure = async (req, res) => {
  const { pageId } = req.params;

  try {
    const page = await Page.findById(pageId)
      .populate({
        path: 'components.component',
        select: '_id name description',
      })
      .populate('pageTypeAttributes')
      .select('_id url description components');

    const structure = buildPageStructure(page.toObject().components);

    res.send(structure);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPages = async (req, res) => {
  const { pageId } = req.params;
  try {
    if (pageId) {
      const singlePage = await Page.findById(pageId);
      res.send(singlePage);
    } else {
      const { limit, page } = req.query;
      let currentPage = page && page > 0 ? Number(page) : 1;
      const resultsLimit = Number(limit) || 0;

      const pagesQuantity = await Page.estimatedDocumentCount();
      const totalPages = resultsLimit ? Math.ceil(pagesQuantity / resultsLimit) : 1;
      const itemsPerPage = resultsLimit || pagesQuantity;

      if (totalPages < currentPage) {
        currentPage = totalPages;
      }

      const skippedResultItems = resultsLimit * (currentPage - 1);

      const pages = await Page.find()
        .populate({
          path: 'components.componentType',
          select: 'name description _id',
        })
        .populate('pageType')
        .skip(skippedResultItems)
        .limit(resultsLimit)
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

  const uniqueComponents = await hasComopnentsUniqueId(req.body.components);

  if (!uniqueComponents) {
    return res.status(400).send('Component Id is not unique');
  }

  try {
    const page = new Page(req.body);
    page.save();
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

  const uniqueComponents = await hasComopnentsUniqueId(req.body.components);

  if (!uniqueComponents) {
    return res.status(400).send('Component Id is not unique');
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
  getPages,
  getPageStructure,
  createPage,
  updatePage,
  deletePage,
};
