const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(
        res,
        'There is no user yet, please register now',
        404
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Password does not match', 400);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set the refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httOnly: true,
      self: true, // Set to true in production with HTTPS
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 100, // 7 days
    });

    return successResponse(res, 'User logged in successfully', { accessToken });
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 500, error);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return errorResponse(res, 'user already exists', 409);
    }

    user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();
    const accessToken = generateAccessToken(user);
    return successResponse(res, 'User registered successfully', accessToken);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return errorResponse(res, 'No refresh token provided', 403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return errorResponse(res, 'Invalid refresh token', 403);

    const newAccessToken = generateAccessToken(user);
    return successResponse(res, 'Token refreshed successfully', {
      accessToken: newAccessToken,
    });
  });
};

const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return successResponse(res, 'User logged out successfully');
};

module.exports = { login, register, refresh, logout };
