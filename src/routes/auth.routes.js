const express = require('express');

const { register } = require('../controllers/auth.controller');
const { validateRegister } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');


const router = express.Router();

router.post('/register', authLimiter, validateRegister, register)




module.exports = router;