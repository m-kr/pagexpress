const { User, userValidationSchema } = require('../models/User');
const bcrypt = require('bcrypt');
const { BadRequest, NotFound } = require('../utils/errors');

const authUser = (req, res, next) => {
  try {
    res.json(res.user);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const query = userId ? User.findById(userId) : User.find();
    const data = await query.exec();

    if (userId && !data) {
      throw new NotFound('User not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  const { email, username, password } = req.body;
  const userByEmail = await User.findOne({ email });
  const userByUsername = await User.findOne({ username });

  if (userByEmail || userByUsername) {
    throw new BadRequest('User already exists');
  }

  try {
    const newUser = new User({ username, email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    const token = newUser.generateAuthToken();
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;

  const user = await User.findById(userId);

  const { error } = userValidationSchema.validate({ username: user.username, email: user.email, password });

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.json({ token, userId });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await User.findByIdAndRemove(userId);
    res.send(userId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authUser,
  getUsers,
  createUser,
  resetPassword,
  deleteUser,
};
