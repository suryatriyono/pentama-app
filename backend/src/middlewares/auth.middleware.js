const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return errorResponse(res, 'Access denied No token provided', 401);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(
        res,
        'Token expired, please refresh your session',
        401
      );
    } else {
      return errorResponse(res, 'Invalid token', 401);
    }
  }
};

module.exports = auth;
