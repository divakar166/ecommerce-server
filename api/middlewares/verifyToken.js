const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and check user role.
 * 
 * @param {string} requiredRole - The role that is required for accessing the route.
 * @returns {Function} - The middleware function.
 */
const verifyToken = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET || 'somesecretsecret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Authorization token invalid' });
      }
      req.user = decoded;
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    });
  };
};

module.exports = verifyToken;
