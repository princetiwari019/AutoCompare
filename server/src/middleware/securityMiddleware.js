const mongoose = require('mongoose');

// In-memory rate limiting store
const rateLimitStore = new Map();

// General Rate Limiter Middleware
const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const max = options.max || 50;
  const message = options.message || 'Too many requests. Please try again later.';

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${options.prefix || 'rate'}_${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitStore.set(key, record);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
};

const loginRateLimiter = createRateLimiter({
  prefix: 'login',
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again later.'
});

const aiRateLimiter = createRateLimiter({
  prefix: 'ai',
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Too many requests. Please try again later.'
});

const uploadRateLimiter = createRateLimiter({
  prefix: 'upload',
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Upload rate limit exceeded. Please wait a few minutes before trying again.'
});

// Security Headers Middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Validate Mongoose ObjectId Middleware
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid vehicle ID format: ${id}`
      });
    }
    next();
  };
};

module.exports = {
  loginRateLimiter,
  aiRateLimiter,
  uploadRateLimiter,
  securityHeaders,
  validateObjectId
};
