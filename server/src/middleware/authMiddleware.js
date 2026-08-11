const { verifyToken } = require('../controllers/authController');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: No token provided'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token'
      });
    }

    const user = await User.findById(decoded.id).select('-passwordHash -salt');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access required'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Authentication failed'
    });
  }
};

module.exports = {
  protectAdmin
};
