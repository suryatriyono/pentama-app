const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authenticateAccessToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return errorResponse(res, { message: 'Access denied no token provided' });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return errorResponse(res, {
        message: 'Invalid access token',
        statusCode: 403,
        errors: err,
      });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateAccessToken;
