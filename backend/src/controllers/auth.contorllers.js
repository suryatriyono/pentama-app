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
      return errorResponse(res, {
        message: 'There is no user yet, please register now',
        statusCode: 404,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, {
        message: 'Password does not match',
        statusCode: 400,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // The required data set in the cookie
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Aktifkan secure hanya di production dengan HTTPS
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000, // 15 minute
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Aktifkan secure hanya di production dengan HTTPS
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    return successResponse(res, {
      message: 'Login Successful',
      success: { isAuthenticated: true, role: user.role },
    });
  } catch (error) {
    return errorResponse(res, {
      message: 'Authentication failed',
      errors: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return errorResponse(res, {
        message: 'user already exists',
        statusCode: 409,
      });
    }

    user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();
    return successResponse(res, { message: 'User registered successfully' });
  } catch (error) {
    return errorResponse(res, { message: 'Register failed', errors: error });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // Check the refresh token
  if (!refreshToken) {
    return errorResponse(res, {
      message: 'No refresh token provided',
      statusCode: 403,
    });
  }
  // Verifying existsting refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return errorResponse(res, {
        message: 'Invalid refresh token',
        statusCode: 403,
        errors: err,
      });
    }
    // Generate a new access token for the user
    const newAccessToken = generateAccessToken(user);
    // Generate a new refresh token for the user
    const newRefsehToken = generateRefreshToken(user);

    res
      .cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000, // 15 menit (15 * 60 * 1000 ms)
      })
      .cookie('refreshToken', newRefsehToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    return successResponse(res, {
      message: 'Token refreshed successfully',
      success: { isAuthenticated: true, role: req.user.role },
    });
  });
};

const checkAuthenticated = (req, res) => {
  if (req.user) {
    return successResponse(res, {
      message: 'User is authenticated',
      success: {
        isAuthenticated: true,
        role: req.user.role,
      },
    });
  } else {
    return errorResponse(res, {
      message: 'User is not authenticated',
      statusCode: 401,
    });
  }
};

const logout = (_, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return successResponse(res, { message: 'User logged out successfully' });
};

module.exports = { login, register, refreshToken, checkAuthenticated, logout };
