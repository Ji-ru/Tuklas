export const errorHandler = (err, req, res, _next) => {
  // Log structured error (avoid dumping full stack traces in production)
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);
  } else {
    console.error(`[ERROR] ${req.method} ${req.path}`, err);
  }

  const statusCode = err.status || 500;

  // Return a safe error response — never leak internals to the client
  res.status(statusCode).json({
    error: err.isOperational ? err.message : 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
  });
};
