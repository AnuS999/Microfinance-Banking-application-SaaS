const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const User = require('../models/User');

const generateToken = (id, tenantId, role) => {
  return jwt.sign({ id, tenantId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new Tenant (Organization) + Org Admin User
// @route   POST /api/auth/register-tenant
// @access  Public
const registerTenant = async (req, res) => {
  try {
    const body = req.body || {};
    const { orgName, slug, orgEmail, phone, adminName, adminEmail, password } = body;

    if (!orgName || !adminEmail || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingOrg = await Organization.findOne({
      $or: [{ slug }, { email: orgEmail }],
    });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization slug or email already registered' });
    }

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User email already registered' });
    }

    // 1. Create Organization
    const organization = await Organization.create({
      name: orgName,
      slug,
      email: orgEmail,
      phone,
    });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Admin User
    const user = await User.create({
      tenantId: organization._id,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      phone,
      role: 'ORG_ADMIN',
    });

    res.status(201).json({
      success: true,
      message: 'Organization registered successfully',
      data: {
        organization: {
          id: organization._id,
          name: organization.name,
          slug: organization.slug,
        },
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id, organization._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('tenantId');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.tenantId && user.tenantId.subscriptionStatus !== 'ACTIVE') {
      return res.status(403).json({ message: 'Organization account is inactive' });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId._id,
          tenantName: user.tenantId.name,
        },
        token: generateToken(user._id, user.tenantId._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('tenantId', 'name slug email phone subscriptionStatus');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerTenant, loginUser, getMe };