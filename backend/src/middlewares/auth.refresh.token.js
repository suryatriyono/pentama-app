const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authenticateRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken; // atau dari header jika itu yang Anda gunakan
  if (!refreshToken) {
    return errorResponse(res, { message: 'Refresh token not provided' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return errorResponse(res, {
        message: 'Invalid refresh token',
        statusCode: 403,
        errors: err,
      });
    }

    // Jika refresh token valid, Anda bisa memberikan akses ke user
    req.user = user; // Anda dapat menyimpan informasi pengguna di req.user
    next();
  });
};

module.exports = authenticateRefreshToken;
