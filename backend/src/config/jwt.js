const jwt = require('jsonwebtoken');
// Generate Acces Token with a shor expiration time
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET, // Use a dedicated secert for access token
    {
      expiresIn: '15m', // Set a shor expiration time for better security
    }
  );
};

// Generate Access Token with a longer expiration time
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
