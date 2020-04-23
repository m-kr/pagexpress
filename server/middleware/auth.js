const jwt = require('jsonwebtoken');
const config = require('config');
const accessDaniedMessage = 'Access danied. No token provided';

const auth = (req, res, next) => {
  const AuthorizationHeader = req.header('Authorization');

  if (!AuthorizationHeader) {
    return res.status(401).send(accessDaniedMessage);
  }

  const [bearerKeyword, token] = AuthorizationHeader.split(' ');

  if (bearerKeyword !== 'Bearer' || !token) {
    return res.status(401).send(accessDaniedMessage);
  }

  try {
    res.user = jwt.verify(token, config.get('jwtPrivateKey'));
    next();
  } catch (e) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = auth;
