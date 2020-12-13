const { GeneralError } = require('../utils/errors');

// eslint-disable-next-line
const errorHandler = (err, req, res, next) => {
  console.error('URL:', req.url);
  console.error('PARAMS:', req.params);
  console.error('DATA:', req.body);
  console.error('Error stack', err.stack);

  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      message: err.message,
      status: 'error',
    });
  }

  return res.status(500).json({
    message: err.message,
    status: 'error',
  });
};

module.exports = errorHandler;
