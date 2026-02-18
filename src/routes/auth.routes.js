const express = require('express');
const { register, login, verifyEmail, logout, getUserProfile, updateProfilePhoto, updateUserProfile} = require('../controllers/auth.controller');
const { uploadProfilePic } = require('../config/multer');
const { validateRegister, validateLogin, validateVerifyEmail } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');
const { verifyAuth } = require('../middlewares/auth');

const router = express.Router();

// public endpoints
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/verify-email', authLimiter, validateVerifyEmail, verifyEmail);

// private endpoints
router.post('/logout', verifyAuth, logout)
router.get('/profile', verifyAuth, getUserProfile)
router.put('/profile/photo', verifyAuth, uploadProfilePic, updateProfilePhoto)
router.put('/profile/updateUser', verifyAuth, updateUserProfile)


module.exports= router