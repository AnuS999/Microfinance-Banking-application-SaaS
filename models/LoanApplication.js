const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema(
  {
    branchName: { type: String, required: true },
    applicationDate: { type: Date, default: Date.now },
    
    // Member Personal Details
    memberName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    age: { type: Number, required: true },
    memberNumber: { type: String, required: true },
    mothersName: { type: String, required: true },
    fathersName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    husbandName: { type: String, required: true },
    
    // Member Current Address
    address: {
      village: { type: String, required: true },
      post: { type: String, required: true },
      policeStation: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      caste: { type: String },
      religion: { type: String },
    },

    // Guarantor Details (jamanatdar)
    guarantor: {
      name: { type: String, required: true },
      fathersName: { type: String, required: true },
      dateOfBirthOrAge: { type: String, required: true },
      relationWithMember: { type: String, required: true },
      voterCardNo: { type: String, required: true },
      aadhaarNumber: { type: String, required: true },
    },

    // KYC & Bank Details
    kycAndBank: {
      memberVoterCardNo: { type: String, required: true },
      memberAadhaarNumber: { type: String, required: true },
      rationCardNo: { type: String },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
      branchName: { type: String, required: true },
      accountNumber: { type: String, required: true },
    },

    // Loan Specifics
    loanDetails: {
      tenureOrCycle: { type: String, required: true }, // Loan Chakar
      loanAmount: { type: Number, required: true },
      loanPurpose: { type: String, required: true }, // Loan Uddeshya
    },

    // Mayke / Parental Background Details
    parentalDetails: {
      fullAddress: { type: String, required: true },
      fatherName: { type: String, required: true },
      fatherMobile: { type: String, required: true },
      brotherName: { type: String },
      brotherMobile: { type: String },
      landmark: { type: String },
    },

    disbursementStatus: {
      type: String,
      enum: ['PENDING', 'DISBURSED', 'REJECTED'],
      default: 'PENDING',
    },
    disbursedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);