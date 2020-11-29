const { roles } = require('../roles/role-grands');

const grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(res.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: 'You do not have enough permission to perform this action',
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = grantAccess;
