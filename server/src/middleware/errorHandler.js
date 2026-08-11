const errorHandler = (err, req, res, next) => {
  console.error(`[Express Error] ${req.method} ${req.originalUrl}:`, err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.message && (
    err.message.includes('Only JPEG') ||
    err.message.includes('file size') ||
    err.name === 'MulterError'
  )) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
