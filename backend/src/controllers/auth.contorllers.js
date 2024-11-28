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
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // self: true, // Set to true in production with HTTPS
        secure: process.env.NODE_ENV === 'production', // Aktifkan secure hanya di production dengan HTTPS
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 1000, // 7 days
      })
      .cookie('isAuthenticated', true, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Aktifkan secure hanya di production dengan HTTPS
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      })
      .cookie('role', user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Aktifkan secure hanya di production dengan HTTPS
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      });

    console.log('login:', req.cookies);

    return successResponse(res, 'Login Successful', {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
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

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('refresh token:', req.cookies);
  if (!refreshToken)
    return errorResponse(res, 'No refresh token provided', 403);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return errorResponse(res, 'Invalid refresh token', 403);
    }

    const newAccessToken = generateAccessToken(user);
    return successResponse(res, 'Token refreshed successfully', {
      accessToken: newAccessToken,
    });
  });
};

const checkAuthenticated = (req, res) => {
  const isAuthenticated = req.cookies.isAuthenticated;
  const role = req.cookies.role;

  console.log('check:', req.cookies);

  if (isAuthenticated) {
    return successResponse(res, 'User is authenticated', {
      isAuthenticated,
      role,
    });
  } else {
    return errorResponse(res, 'User is not authenticated', 401);
  }
};

const logout = (_, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('role');
  res.clearCookie('isAuthenticated');
  return successResponse(res, 'User logged out successfully');
};

module.exports = { login, register, refreshToken, checkAuthenticated, logout };
