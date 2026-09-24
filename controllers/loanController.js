const Loan = require('../models/Loan');

// Helper to calculate Reducing Balance Amortization
const generateAmortization = (principal, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;
  const schedule = [];
  let currentDate = new Date();

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

    schedule.push({
      installmentNo: i,
      dueDate: new Date(currentDate),
      principalComponent: Math.round(principalPaid),
      interestComponent: Math.round(interest),
      totalPayment: Math.round(emi),
      remainingBalance: Math.round(balance),
      status: 'PENDING',
    });
  }
  return schedule;
};

// 1. Disburse New Loan
exports.disburseLoan = async (req, res, next) => {
  try {
    const { borrowerId, principalAmount, annualInterestRate, tenureMonths } = req.body;

    const schedule = generateAmortization(
      Number(principalAmount),
      Number(annualInterestRate),
      Number(tenureMonths)
    );

    const loan = await Loan.create({
      borrower: borrowerId,
      principalAmount,
      annualInterestRate,
      tenureMonths,
      schedule,
    });

    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};

// 2. Fetch Active Loans with Borrower Details
exports.getLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find().populate('borrower', 'fullName phone aadhaarNumber').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    next(error);
  }
};

// 3. Mark Installment as Paid
exports.payInstallment = async (req, res, next) => {
  try {
    const { loanId, installmentId } = req.params;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    const installment = loan.schedule.id(installmentId);
    if (!installment) return res.status(404).json({ message: 'Installment not found' });

    installment.status = 'PAID';
    installment.paidAt = new Date();

    // Check if all installments paid -> Close Loan
    const allPaid = loan.schedule.every((item) => item.status === 'PAID');
    if (allPaid) loan.status = 'CLOSED';

    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};