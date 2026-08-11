const User = require('../models/User');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'autocompare_secret_key_2026_super_secure';

// Helper to sign lightweight JWT token using Node crypto
const generateToken = (userId, role) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      id: userId,
      role: role,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
};

// Helper to verify token signature
const verifyToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch (e) {
    return null;
  }
};

// @desc    Admin Login Endpoint
// @route   POST /api/admin/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin role required'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Change Password Endpoint
// @route   POST /api/admin/auth/change-password
// @access  Private (Admin)
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password, new password, and password confirmation'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
    }

    // Password strength check (min 8 chars, uppercase, lowercase, digit)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long and contain uppercase, lowercase, and numeric digits'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    const isMatch = user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Re-hash with fresh salt
    const newSalt = crypto.randomBytes(16).toString('hex');
    user.salt = newSalt;
    user.passwordHash = User.hashPassword(newPassword, newSalt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please log in with your new credentials.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Logout Endpoint
// @route   POST /api/admin/auth/logout
// @access  Private (Admin)
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get Current Logged in Admin Profile
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
const getCurrentAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  changePassword,
  logout,
  getCurrentAdmin,
  verifyToken
};
