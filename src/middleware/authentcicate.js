const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No authorization token provided",
        code: "AUTH_MISSING",
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expired",
          code: "AUTH_EXPIRED",
        });
      }
      return res.status(401).json({
        error: "Invalid token",
        code: "AUTH_INVALID",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Authorization Middleware
 * Checks if user has required role/permission
 */
const authorize = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "User not authenticated",
      });
    }

    // Add role/permission check logic here
    // For now, simple implementation
    if (requiredRoles.length === 0) {
      return next();
    }

    // In production, fetch user roles from database
    // and compare with requiredRoles
    next();
  };
};

/**
 * Rate Limiting Middleware
 */
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    const userId = req.user?.userId || req.ip;
    const now = Date.now();
    const userRequests = requestCounts.get(userId) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter((time) => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
      });
    }

    recentRequests.push(now);
    requestCounts.set(userId, recentRequests);
    next();
  };
};

/**
 * Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    requestId: req.id,
  });
};

/**
 * Validation Error Formatter
 */
const formatValidationErrors = (errors) => {
  const formatted = {};
  errors.forEach((error) => {
    if (!formatted[error.param]) {
      formatted[error.param] = [];
    }
    formatted[error.param].push(error.msg);
  });
  return formatted;
};

module.exports = {
  authenticate,
  authorize,
  rateLimit,
  errorHandler,
  formatValidationErrors,
};
