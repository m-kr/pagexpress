const { PageAttributeType } = require('../models');

const getPageAttributeTypes = async (req, res) => {
  const { pageAttributeTypeId } = req.params;

  try {
    const query = pageAttributeTypeId ? PageAttributeType.findById(pageAttributeTypeId) : PageAttributeType.find();
    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createPageAttributeType = async (req, res) => {
  try {
    const pageAttributeType = new PageAttributeType(req.body);
    pageAttributeType.save();
    res.send(pageAttributeType._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePageAttributeType = async (req, res) => {
  const { pageAttributeTypeId } = req.params;

  try {
    const pageAttributeType = await PageAttributeType.findOneAndUpdate({ _id: pageAttributeTypeId }, req.body);
    res.send(pageAttributeType);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePageAttributeType = async (req, res) => {
  const { pageAttributeTypeId } = req.params;

  try {
    await PageAttributeType.findByIdAndRemove(pageAttributeTypeId);
    res.send(pageAttributeTypeId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPageAttributeTypes,
  createPageAttributeType,
  updatePageAttributeType,
  deletePageAttributeType,
};
