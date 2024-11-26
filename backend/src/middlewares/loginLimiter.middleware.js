const ratelimit = require('express-rate-limit');

const loginLimiter = ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 mint.',
  },
  header: true,
});

module.exports = loginLimiter;
