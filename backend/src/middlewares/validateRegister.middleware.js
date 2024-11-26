const { body } = require('express-validator');
const handleValidationErrors = require('./handleValidationErrors.middleware');

const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Inavid email format')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email must bee less than 100 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must a number')
    .matches(/[A-Z]/)
    .withMessage('Passwod must be conatain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must be conatain at least one lowercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must be conatain at least one special character'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters')
    .trim()
    .escape(),
  body('role')
    .isIn(['lecturer', 'student'])
    .withMessage('Role must be lecturer or student'),
  handleValidationErrors,
];

module.exports = validateRegister;
