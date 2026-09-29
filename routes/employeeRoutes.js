const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Register New Employee / Create Route
router.post('/create', async (req, res) => {
  try {
    let { 
      employeeCode, 
      fullName, 
      email, 
      password, 
      role, 
      designation, 
      phoneNumber, 
      salary, 
      joiningDate, 
      address 
    } = req.body;

    if (!employeeCode) {
      employeeCode = 'LIN' + Math.floor(100000 + Math.random() * 900000);
    }

    const existingEmployee = await Employee.findOne({ 
      $or: [{ email }, { employeeCode }] 
    });
    
    if (existingEmployee) {
      return res.status(400).json({ 
        success: false, 
        message: 'Employee with this Email or Employee Code already exists!' 
      });
    }

    const newEmployee = new Employee({
      employeeCode,
      name: fullName,
      fullName,
      email,
      password, 
      role: role || 'Agent',
      designation,
      phoneNumber,
      salary,
      joiningDate,
      address
    });

    await newEmployee.save();

    res.status(201).json({ 
      success: true, 
      message: 'Employee registered successfully with login access!' 
    });

  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Employee & Admin Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    let query = { email };
    if (role) query.role = role;

    const employee = await Employee.findOne(query);
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid email, or selected role does not match!' 
      });
    }

    if (employee.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password!' 
      });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET || 'secret_key_12345',
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
        designation: employee.designation
      }
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Get All Employees List Route (Admin Only)
router.get('/', protect, authorize('Admin', 'ADMIN'), async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;