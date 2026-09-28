const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); // Ensure your Employee model file exists and is correct

// 1. Register New Employee / Create Route
router.post('/create', async (req, res) => {
  try {
    const { 
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

    // Check if employee already exists by email or employeeCode
    const existingEmployee = await Employee.findOne({ 
      $or: [{ email }, { employeeCode }] 
    });
    
    if (existingEmployee) {
      return res.status(400).json({ 
        success: false, 
        message: 'Employee with this Email or Employee Code already exists!' 
      });
    }

    // Create new employee record
    const newEmployee = new Employee({
      employeeCode,
      fullName,
      email,
      password, // (Optional: You can use bcrypt to hash this if required)
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
    
    // Find employee by email and role
    const employee = await Employee.findOne({ email, role });
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid email, or selected role does not match!' 
      });
    }

    // Password check
    if (employee.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect password!' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      user: {
        id: employee._id,
        name: employee.fullName,
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

// 3. Get All Employees List Route
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;