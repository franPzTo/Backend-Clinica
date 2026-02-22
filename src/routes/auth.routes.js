const express = require('express');

const { register, login, verifyEmail } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');


const router = express.Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
// router.post('/verify-email', authLimiter, verifyEmail);




module.exports = router;