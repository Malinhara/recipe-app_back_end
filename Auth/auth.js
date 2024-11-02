const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const Auth = {
  createToken(userId, email, role) {
    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  },

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  
    const { valid, decoded, error } = Auth.verifyToken(token);
    if (!valid) return res.status(401).json({ success: false, error });
    
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;


    next();
  }
};

module.exports = Auth;
