const express = require('express');
const router = express.Router();
const validateRegister = require('../middlewares/validateRegister.middleware');
const validateLogin = require('../middlewares/validatateLogin.middleware');
const { login, register } = require('../controllers/auth.contorllers');

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);

module.exports = router;
