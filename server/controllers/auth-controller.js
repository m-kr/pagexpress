const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const { BadRequest, NotFound } = require('../utils/errors');

const auth = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    next(err);
  }

  if (!user) {
    throw new NotFound('No user with provided email');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new BadRequest('Invalid password');
  }

  const token = user.generateAuthToken();
  res.json({ token });
};

module.exports = auth;
