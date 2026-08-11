const express = require('express');
const router = express.Router();
const { login, changePassword, logout, getCurrentAdmin } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { loginRateLimiter } = require('../middleware/securityMiddleware');

router.post('/login', loginRateLimiter, login);
router.post('/change-password', protectAdmin, loginRateLimiter, changePassword);
router.post('/logout', protectAdmin, logout);
router.get('/me', protectAdmin, getCurrentAdmin);

module.exports = router;
