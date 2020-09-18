const { PageTemplate, pageTemplateValidationSchema } = require('../models/PageTemplate');

const getPageTemplates = async (req, res) => {
  const { pageTemplateId } = req.params;

  try {
    const query = (await pageTemplateId) ? PageTemplate.findById(pageTemplateId) : PageTemplate.find();
    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPageTemplate = async (req, res) => {
  const { error } = pageTemplateValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const pageTemplate = new PageTemplate(req.body);
    pageTemplate.save();
    res.send(pageTemplate._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePageTemplate = async (req, res) => {
  const { error } = pageTemplateValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { pageTemplateId } = req.params;

  try {
    const pageTemplate = await PageTemplate.findOneAndUpdate({ _id: pageTemplateId }, req.body);
    res.send(pageTemplate);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePageTemplate = async (req, res) => {
  const { pageTemplateId } = req.params;

  try {
    await PageTemplate.findByIdAndRemove(pageTemplateId);
    res.send(pageTemplateId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageTemplates,
  createPageTemplate,
  updatePageTemplate,
  deletePageTemplate,
};
