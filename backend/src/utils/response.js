const successResponse = (
  res,
  { message = 'Response successfully', success = null }
) => {
  return res.status(200).json({ message, success });
};

const errorResponse = (
  res,
  { message = 'Response error', statusCode = 500, errors = null }
) => {
  return res.status(statusCode).json({ message, errors });
};

module.exports = { successResponse, errorResponse };
