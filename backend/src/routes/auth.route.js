const express = require('express');
const router = express.Router();
const validateRegister = require('../middlewares/validateRegister.middleware');
const validateLogin = require('../middlewares/validateLogin.middleware');
const authAccess = require('../middlewares/auth.acsess.token');
const {
  login,
  register,
  refreshToken,
  checkAuthenticated,
  logout,
} = require('../controllers/auth.contorllers');

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

router.get('/check-authenticated', authAccess, checkAuthenticated); // This route should require authentication to access it.

module.exports = router;
