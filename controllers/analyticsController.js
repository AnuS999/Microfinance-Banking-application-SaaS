const Loan = require('../models/Loan');
const Borrower = require('../models/Borrower');

// @desc    Get real-time dashboard metrics from MongoDB
// @route   GET /api/analytics/dashboard
exports.getDashboardMetrics = async (req, res, next) => {
  try {
    // 1. Total Borrowers Count
    const totalBorrowers = await Borrower.countDocuments();

    // 2. Fetch all Loans from DB
    const loans = await Loan.find();

    let totalDisbursed = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let activeLoansCount = 0;

    loans.forEach((loan) => {
      // Principal Amount Addition
      const principal = Number(loan.principalAmount) || 0;
      totalDisbursed += principal;

      // Check Active Loan status (case-insensitive check)
      const currentStatus = (loan.status || '').toUpperCase();
      if (currentStatus === 'ACTIVE' || currentStatus === 'DISBURSED') {
        activeLoansCount += 1;
      }

      // Schedule tracking
      if (loan.schedule && Array.isArray(loan.schedule)) {
        loan.schedule.forEach((item) => {
          const emiAmount = Number(item.totalPayment) || 0;
          const emiStatus = (item.status || '').toUpperCase();

          if (emiStatus === 'PAID') {
            totalCollected += emiAmount;
          } else {
            totalPending += emiAmount;
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalBorrowers,
        activeLoansCount,
        totalDisbursed,
        totalCollected,
        totalPending,
      },
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    next(error);
  }
};