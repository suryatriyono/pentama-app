const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return errorResponse(res, {
      message: 'Access denied No token provided',
      statusCode: 401,
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, {
        message: 'Token expired, please refresh your session',
        statusCode: 401,
      });
    } else {
      return errorResponse(res, { message: 'Invalid token', statusCode: 401 });
    }
  }
};

module.exports = auth;
