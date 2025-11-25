const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: convert userId → _id so Mongoose accepts it
    req.user = {
      _id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
