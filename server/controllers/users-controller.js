const { User, userValidationSchema } = require('../models/User');
const bcrypt = require('bcrypt');

const authUser = (req, res) => {
  try {
    console.log('user', res.user);
    res.send(res.user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const query = (await userId) ? User.findById(userId) : User.find();
    const data = await query.exec();
    res.send(data);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const createUser = async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const { email, username, password } = req.body;
  const userByEmail = await User.findOne({ email });
  const userByUsername = await User.findOne({ username });

  if (userByEmail || userByUsername) {
    return res.status(400).send({ error: 'User already exists' });
  }

  try {
    const newUser = new User({ username, email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    newUser.save();

    const token = newUser.generateAuthToken();
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  const user = await User.findById(userId);

  const { error } = userValidationSchema.validate({ username: user.username, email: user.email, password });

  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.save();
    const token = user.generateAuthToken();
    res.send({ token, userId });
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
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  authUser,
  getUsers,
  createUser,
  resetPassword,
  deleteUser,
};
