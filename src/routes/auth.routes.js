const express = require('express');

const { register, login, verifyEmail } = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateEmail } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');


const router = express.Router();
// Rutas de Autenticación y Aublicas
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/verify-email', authLimiter, validateEmail, verifyEmail);

// Rutas de Privadas



module.exports = router;