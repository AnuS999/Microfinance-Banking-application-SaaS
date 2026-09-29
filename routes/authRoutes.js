const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_microfinance');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Common Employee Creation Logic handler function
const handleCreateEmployee = async (req, res) => {

  try {
    const { fullName, name, email, password, role, designation, salary, employeeCode, address, phone } = req.body;
    
    const empName = fullName || name || (email ? email.split('@')[0] : 'User');

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered!' });
    }

    const newEmp = new Employee({
      name: empName,
      fullName: empName,
      email,
      password,
      role: role || 'Agent',
      designation: designation || 'Field Officer',
      salary: salary || 0,
      employeeCode: employeeCode || '',
      address: address || '',
      phone: phone || ''
    });

    await newEmp.save();
    console.log('Employee created successfully in DB');
    res.status(201).json({ success: true, message: `${role || 'Agent'} account created successfully!`, data: newEmp });
  } catch (err) {
    console.error('Create Employee Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 1. Create Employee Routes (Supporting both endpoint paths to prevent 404/500 mismatch)
router.post('/create-employee', handleCreateEmployee);
router.post('/create', handleCreateEmployee);

// 2. Login Route
router.post('/login', async (req, res) => {
  

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const employee = await Employee.findOne({ email: email.trim() });
    if (!employee || employee.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid Email or Password' });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET || 'secret_key_microfinance',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: employee._id,
        name: employee.fullName || employee.name,
        email: employee.email,
        role: employee.role,
        designation: employee.designation,
        employeeCode: employee.employeeCode,
        salary: employee.salary,
        address: employee.address,
        createdAt: employee.createdAt
      }
    });
  } catch (err) {
  
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Get Logged-in User Profile Route
router.get('/profile', verifyToken, async (req, res) => {

  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: employee });
  } catch (err) {

    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;