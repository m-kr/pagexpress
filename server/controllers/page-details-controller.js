const { PageDetails, pageDetailsValidationSchema } = require('../models/PageDetailsDetails');
const { buildPageDetailsStructure } = require('../utils/pageDetails-structure');

const hasComopnentsUniqueId = async components => {
  if (!(components && components.length)) {
    return true;
  }

  const componentsIds = components.map(component => component._id);
  const existedPageDetailsComponentWithTheSameId = await PageDetails.find({ 'components._id': { $in: componentsIds } });

  return !existedPageDetailsComponentWithTheSameId.length;
};

const getPageDetailsStructure = async (req, res) => {
  const { pageDetailsId } = req.params;

  try {
    const pageDetails = await PageDetails.findById(pageDetailsId)
      .populate({
        path: 'components.component',
        select: '_id name description',
      })
      .populate('pageDetailsTypeAttributes')
      .select('_id url description components');

    const structure = buildPageDetailsStructure(pageDetails.toObject().components);

    res.send(structure);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPageDetails = async (req, res) => {
  const { pageDetailsId } = req.params;

  try {
    if (pageDetailsId) {
      const singlePageDetails = await PageDetails.findById(pageDetailsId).populate('country').exec();

      if (!singlePageDetails) {
        throw new Error('Page details not exist');
      }

      res.send(singlePageDetails);
    } else {
      const query = req.body.pageId ? { pageId: req.body.pageId } : {};
      const pageDetails = await PageDetails.find(query).populate('country').exec();

      res.send(pageDetails);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPageDetails = async (req, res) => {
  const { error } = pageDetailsValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const uniqueComponents = await hasComopnentsUniqueId(req.body.components);

  if (!uniqueComponents) {
    return res.status(400).send('Component Id is not unique');
  }

  try {
    const pageDetails = new PageDetails(req.body);
    pageDetails.save();
    res.send(pageDetails._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePageDetails = async (req, res) => {
  const { error } = pageDetailsValidationSchema.validate(req.body);
  const { pageDetailsId } = req.params;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const uniqueComponents = await hasComopnentsUniqueId(req.body.components);

  if (!uniqueComponents) {
    return res.status(400).send('Component Id is not unique');
  }

  try {
    const pageDetails = await PageDetails.findOneAndUpdate({ _id: pageDetailsId }, req.body);
    res.send(pageDetails);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePageDetails = async (req, res) => {
  const { pageDetailsId } = req.params;

  try {
    await PageDetails.findByIdAndRemove(pageDetailsId);
    res.send(pageDetailsId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageDetails,
  getPageDetailsStructure,
  createPageDetails,
  updatePageDetails,
  deletePageDetails,
};
