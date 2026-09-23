const Borrower = require('../models/Borrower');

// @desc    Create a new Borrower
// @route   POST /api/borrowers
// @access  Private (ORG_ADMIN, LOAN_OFFICER)
const createBorrower = async (req, res) => {
  try {
    const { name, phone, email, address, aadhaarNumber, panNumber, occupation, monthlyIncome } = req.body;

    // Duplicate check strictly within CURRENT TENANT
    const existingBorrower = await Borrower.findOne({
      tenantId: req.user.tenantId,
      $or: [{ phone }, { aadhaarNumber }],
    });

    if (existingBorrower) {
      return res.status(400).json({
        message: 'Borrower with this phone or Aadhaar number already exists in your organization',
      });
    }

    const borrower = await Borrower.create({
      tenantId: req.user.tenantId, // Auto-injected from JWT token
      name,
      phone,
      email,
      address,
      aadhaarNumber,
      panNumber,
      occupation,
      monthlyIncome,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: borrower,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Borrowers for logged-in Tenant (Search + Pagination)
// @route   GET /api/borrowers
// @access  Private
const getBorrowers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Search query strictly scoped to tenantId
    const query = {
      tenantId: req.user.tenantId,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { aadhaarNumber: { $regex: search, $options: 'i' } },
      ],
    };

    const total = await Borrower.countDocuments(query);
    const borrowers = await Borrower.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: borrowers.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: borrowers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single Borrower by ID
// @route   GET /api/borrowers/:id
// @access  Private
const getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId, // Prevents cross-tenant access
    });

    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    res.status(200).json({ success: true, data: borrower });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Borrower details
// @route   PUT /api/borrowers/:id
// @access  Private (ORG_ADMIN, LOAN_OFFICER)
const updateBorrower = async (req, res) => {
  try {
    let borrower = await Borrower.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }

    borrower = await Borrower.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: borrower });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBorrower,
  getBorrowers,
  getBorrowerById,
  updateBorrower,
};