const { Component } = require('../models');

const getComponents = async (req, res) => {
  const { componentId } = req.params;

  try {
    const query = (await componentId) ? Component.findById(componentId) : Component.find();

    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createComponent = async (req, res) => {
  try {
    const component = new Component(req.body);
    component.save();
    res.send(component._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateComponent = async (req, res) => {
  const { componentId } = req.params;

  try {
    const component = await Component.findOneAndUpdate({ _id: componentId }, req.body);
    res.send(component);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteComponent = async (req, res) => {
  const { componentId } = req.params;

  try {
    await Component.findByIdAndRemove(componentId);
    res.send(componentId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
};
