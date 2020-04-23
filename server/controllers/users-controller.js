const { User, userValidationSchema } = require('../models/User');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = (await userId) ? User.findById(userId) : User.find();
    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUser = async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).send('User already exists');
  }

  try {
    const newUser = new User({ email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    newUser.save();

    const token = newUser.generateAuthToken();
    res.header('auth-token', token).send(newUser._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const resetPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  const user = await User.findById(userId);

  const { error } = userValidationSchema.validate({ email: user.email, password });

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ userId });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndRemove(userId);
    res.send(userId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getUsers,
  createUser,
  resetPassword,
  deleteUser,
};
