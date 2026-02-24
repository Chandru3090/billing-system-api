const config = require('../config/config'); // Import the config file

const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: config.nodeEnv === 'development' ? err : {},
  });
}

module.exports = globalErrorHandler;