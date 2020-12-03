const { PageTemplate, pageTemplateValidationSchema } = require('../models/PageTemplate');
const { BadRequest, NotFound } = require('../utils/errors');

const getPageTemplates = async (req, res, next) => {
  const { pageTemplateId } = req.params;

  try {
    const query = pageTemplateId ? PageTemplate.findById(pageTemplateId) : PageTemplate.find();
    const data = await query.exec();

    if (pageTemplateId && !data) {
      throw new NotFound('Page template not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createPageTemplate = async (req, res, next) => {
  const { error } = pageTemplateValidationSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  try {
    const pageTemplate = new PageTemplate(req.body);
    await pageTemplate.save();
    res.send(pageTemplate._id);
  } catch (err) {
    next(err);
  }
};

const updatePageTemplate = async (req, res, next) => {
  const { error } = pageTemplateValidationSchema.validate(req.body);
  const { pageTemplateId } = req.params;

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  try {
    const pageTemplate = await PageTemplate.findOneAndUpdate({ _id: pageTemplateId }, req.body);
    res.json(pageTemplate);
  } catch (err) {
    next(err);
  }
};

const deletePageTemplate = async (req, res, next) => {
  const { pageTemplateId } = req.params;

  try {
    await PageTemplate.findByIdAndRemove(pageTemplateId);
    res.send(pageTemplateId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPageTemplates,
  createPageTemplate,
  updatePageTemplate,
  deletePageTemplate,
};
