const { body, validationResult } = require('express-validator');
const handleValidationErrors = require('./handleValidationErrors.middleware');

// Middleware for input login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must be at least than 100 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors,
];

module.exports = validateLogin;
