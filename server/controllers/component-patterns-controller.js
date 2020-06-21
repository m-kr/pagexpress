const { ComponentPattern, componentPatternValidationSchema } = require('../models/ComponentPattern');

const getComponentPatterns = async (req, res) => {
  const { componentPaternId } = req.params;

  try {
    const query = (await componentPaternId) ? ComponentPattern.findById(componentPaternId) : ComponentPattern.find();

    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createComponentPattern = async (req, res) => {
  const { error } = componentPatternValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const componentPattern = new ComponentPattern(req.body);
    await componentPattern.save();
    res.send(componentPattern._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateComponentPattern = async (req, res) => {
  const { error } = componentPatternValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { componentPatternId } = req.params;

  try {
    const componentPattern = await ComponentPattern.findOneAndUpdate({ _id: componentPatternId }, req.body);
    res.send(componentPattern);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteComponentPattern = async (req, res) => {
  const { componentPatternId } = req.params;

  try {
    await ComponentPattern.findByIdAndRemove(componentPatternId);
    res.send(componentPatternId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getComponentPatterns,
  createComponentPattern,
  updateComponentPattern,
  deleteComponentPattern,
};
