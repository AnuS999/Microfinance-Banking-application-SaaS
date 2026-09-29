const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee'); // User ki jagah Employee model use hoga

// Protect Routes (Verify JWT Token)
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_12345');
    
    // Employee collection se logged-in user ko find karna
    req.user = await Employee.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Token failed: Employee not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

// Authorize Roles (RBAC Check)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};