const { errorResponse } = require('../utils/response');

const validateRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.body.role)) {
      return errorResponse(
        res,
        'Access forbidden: insufficient role privileges!'
      );
    }
    next();
  };
};

module.exports = validateRole;
