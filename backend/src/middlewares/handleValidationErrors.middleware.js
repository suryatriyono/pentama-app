const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');
const haddleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsDetails = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return errorResponse(res, {
      message: 'Validation error',
      statusCode: 400,
      errors: errorsDetails,
    });
  }
  next();
};

module.exports = haddleValidationErrors;
