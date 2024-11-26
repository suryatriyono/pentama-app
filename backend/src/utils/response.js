const successResponse = (res, message, success = null) => {
  return res.status(200).json({ message, success });
};

const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({ message, errors });
};

module.exports = { successResponse, errorResponse };
