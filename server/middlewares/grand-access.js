const { roles } = require('../roles/role-grands');

const grantAccess = (action, resource) => async (req, res, next) => {
  if (!res.user) {
    return next();
  }

  try {
    const permission = roles.can(res.user.role)[action](resource);
    if (!permission.granted) {
      return res.status(401).json({
        message: 'You do not have enough permission to perform this action',
        status: 'error',
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = grantAccess;
