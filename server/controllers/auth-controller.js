const { User } = require('../models/User');
const bcrypt = require('bcrypt');

const auth = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('Invalid email or password');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send('Invalid email or password');
  }

  const token = user.generateAuthToken();
  res.send({ token });
};

module.exports = auth;
