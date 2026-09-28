const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_key_12345', {
    expiresIn: '7d',
  });
};

// @desc    Register a new employee / user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  console.log('========================================');
  console.log('🚨 REGISTER ROUTE HIT IN authController.js');
  console.log('Request Body:', req.body);
  console.log('========================================');

  try {
    const { fullName, name, email, password, role, designation, salary, employeeCode, phoneNumber, address } = req.body;
    const empName = fullName || name;

    if (!empName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields (fullName, email, password)' 
      });
    }

    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      fullName: empName,
      email,
      password: hashedPassword,
      role: role || 'Agent',
      designation: designation || 'Field Officer',
      salary: salary || 0,
      employeeCode: employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      phoneNumber: phoneNumber || '',
      address: address || ''
    });

    const token = generateToken(employee._id, employee.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: employee._id,
        name: employee.fullName,
        email: employee.email,
        role: employee.role,
        designation: employee.designation,
        token,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during registration' 
    });
  }
};

// @desc    Login employee & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  console.log('========================================');
  console.log('🚨 LOGIN ROUTE HIT IN authController.js');
  console.log('Request Body:', req.body);
  console.log('========================================');

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    const employee = await Employee.findOne({ email: email.trim() }).select('+password');
    console.log("Found Employee in DB:", employee ? employee.email : "Not Found");

    if (!employee) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password (User not found in DB)' 
      });
    }

    let isMatch = false;
    if (employee.password && (employee.password.startsWith('$2a$') || employee.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(password, employee.password);
    } else {
      isMatch = (password === employee.password);
    }

    console.log("Password Match Status:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password (Password mismatch)' 
      });
    }

    const token = generateToken(employee._id, employee.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: employee._id,
        name: employee.fullName || employee.name,
        email: employee.email,
        role: employee.role,
        designation: employee.designation || 'Field Officer',
        token,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during login' 
    });
  }
};