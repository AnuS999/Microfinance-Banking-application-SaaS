import React, { useState } from 'react';
import API from '../api/axiosInstance';
import { FileText, Send, Download } from 'lucide-react';

const initialFormState = {
  branchName: '',
  applicationDate: new Date().toISOString().split('T')[0],
  memberName: '',
  dateOfBirth: '',
  age: '',
  memberNumber: '',
  mothersName: '',
  fathersName: '',
  mobileNumber: '',
  husbandName: '',
  address: { village: '', post: '', policeStation: '', district: '', state: '', pinCode: '', caste: '', religion: '' },
  guarantor: { name: '', fathersName: '', dateOfBirthOrAge: '', relationWithMember: '', voterCardNo: '', aadhaarNumber: '[Aadhaar Redacted]' },
  kycAndBank: { memberVoterCardNo: '', memberAadhaarNumber: '[Aadhaar Redacted]', rationCardNo: '', ifscCode: '', bankName: '', branchName: '', accountNumber: '' },
  loanDetails: { tenureOrCycle: '', loanAmount: '', loanPurpose: '' },
  parentalDetails: { fullAddress: '', fatherName: '', fatherMobile: '', brotherName: '', brotherMobile: '', landmark: '' },
};

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const handleChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/loan-applications/create', formData);
      alert('LinIn Loan Application Form (LOA) submitted successfully!');
      setFormData(initialFormState); // Form reset / screen se data hatane ke liye
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print(); // Browser ka print dialog khulega jisse PDF save ki ja sakti hai
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-indigo-600" size={22} /> LinIn - Member Disbursement Form (LOA)
            </h1>
            <p className="text-xs text-slate-500">LinIn Microcare Foundation • Loan Application & KYC Verification</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} /> Download / Print LOA
            </button>
            <input
              type="date"
              value={formData.applicationDate}
              onChange={(e) => handleChange(null, 'applicationDate', e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
          {/* Branch & Member Personal Info */}
          <div className="space-y-4">
            <h2 className="font-bold text-indigo-600 uppercase tracking-wide border-b pb-1">1. Member Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="शाखा का नाम (Branch Name)" value={formData.branchName} onChange={(e) => handleChange(null, 'branchName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य का नाम (Member Name)" value={formData.memberName} onChange={(e) => handleChange(null, 'memberName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य की जन्म तिथि (DOB)" value={formData.dateOfBirth} onChange={(e) => handleChange(null, 'dateOfBirth', e.target.value)} required className="p-2 border rounded" />
              <input type="number" placeholder="उम्र (Age)" value={formData.age} onChange={(e) => handleChange(null, 'age', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य संख्या (Member No)" value={formData.memberNumber} onChange={(e) => handleChange(null, 'memberNumber', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य की माँ का नाम (Mother's Name)" value={formData.mothersName} onChange={(e) => handleChange(null, 'mothersName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य के पिता का नाम (Father's Name)" value={formData.fathersName} onChange={(e) => handleChange(null, 'fathersName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य का मोबाइल नं." value={formData.mobileNumber} onChange={(e) => handleChange(null, 'mobileNumber', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य के पति का नाम (Husband's Name)" value={formData.husbandName} onChange={(e) => handleChange(null, 'husbandName', e.target.value)} required className="p-2 border rounded" />
            </div>
          </div>

          {/* Member Address */}
          <div className="space-y-4">
            <h2 className="font-bold text-indigo-600 uppercase tracking-wide border-b pb-1">2. Member Current Address (घर का पता)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input type="text" placeholder="ग्राम (Village)" value={formData.address.village} onChange={(e) => handleChange('address', 'village', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="पोस्ट (Post)" value={formData.address.post} onChange={(e) => handleChange('address', 'post', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="थाना (Police Station)" value={formData.address.policeStation} onChange={(e) => handleChange('address', 'policeStation', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="जिला (District)" value={formData.address.district} onChange={(e) => handleChange('address', 'district', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="राज्य (State)" value={formData.address.state} onChange={(e) => handleChange('address', 'state', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="पिन कोड (Pin Code)" value={formData.address.pinCode} onChange={(e) => handleChange('address', 'pinCode', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="जाति (Caste)" value={formData.address.caste} onChange={(e) => handleChange('address', 'caste', e.target.value)} className="p-2 border rounded" />
              <input type="text" placeholder="धर्म (Religion)" value={formData.address.religion} onChange={(e) => handleChange('address', 'religion', e.target.value)} className="p-2 border rounded" />
            </div>
          </div>

          {/* Guarantor Details */}
          <div className="space-y-4">
            <h2 className="font-bold text-indigo-600 uppercase tracking-wide border-b pb-1">3. जमानतदार के विषय में जानकारी (Guarantor Details)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="जमानतदार का नाम" value={formData.guarantor.name} onChange={(e) => handleChange('guarantor', 'name', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="जमानतदार के पिता का नाम" value={formData.guarantor.fathersName} onChange={(e) => handleChange('guarantor', 'fathersName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="जमानतदार की जन्म तिथि / उम्र" value={formData.guarantor.dateOfBirthOrAge} onChange={(e) => handleChange('guarantor', 'dateOfBirthOrAge', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य से सम्बन्ध (Relation)" value={formData.guarantor.relationWithMember} onChange={(e) => handleChange('guarantor', 'relationWithMember', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="जमानतदार का Voter Card No" value={formData.guarantor.voterCardNo} onChange={(e) => handleChange('guarantor', 'voterCardNo', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="जमानतदार का ID No" value={formData.guarantor.aadhaarNumber} onChange={(e) => handleChange('guarantor', 'aadhaarNumber', e.target.value)} required className="p-2 border rounded" />
            </div>
          </div>

          {/* KYC & Bank Details */}
          <div className="space-y-4">
            <h2 className="font-bold text-indigo-600 uppercase tracking-wide border-b pb-1">4. KYC & Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="सदस्य का Voter Card No" value={formData.kycAndBank.memberVoterCardNo} onChange={(e) => handleChange('kycAndBank', 'memberVoterCardNo', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य का ID No" value={formData.kycAndBank.memberAadhaarNumber} onChange={(e) => handleChange('kycAndBank', 'memberAadhaarNumber', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य का राशन कार्ड (Ration Card)" value={formData.kycAndBank.rationCardNo} onChange={(e) => handleChange('kycAndBank', 'rationCardNo', e.target.value)} className="p-2 border rounded" />
              <input type="text" placeholder="IFSC Code" value={formData.kycAndBank.ifscCode} onChange={(e) => handleChange('kycAndBank', 'ifscCode', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="बैंक का नाम (Bank Name)" value={formData.kycAndBank.bankName} onChange={(e) => handleChange('kycAndBank', 'bankName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="शाखा का नाम (Branch Name)" value={formData.kycAndBank.branchName} onChange={(e) => handleChange('kycAndBank', 'branchName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="सदस्य का बैंक खाता नं. (Account No)" value={formData.kycAndBank.accountNumber} onChange={(e) => handleChange('kycAndBank', 'accountNumber', e.target.value)} required className="p-2 border rounded" />
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-4">
            <h2 className="font-bold text-indigo-600 uppercase tracking-wide border-b pb-1">5. Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="लोन चकर / Tenure (e.g. 50 Weeks)" value={formData.loanDetails.tenureOrCycle} onChange={(e) => handleChange('loanDetails', 'tenureOrCycle', e.target.value)} required className="p-2 border rounded" />
              <input type="number" placeholder="लोन अमाउंट (Loan Amount)" value={formData.loanDetails.loanAmount} onChange={(e) => handleChange('loanDetails', 'loanAmount', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="लोन उद्देश्य (Purpose e.g. Dairy/Business)" value={formData.loanDetails.loanPurpose} onChange={(e) => handleChange('loanDetails', 'loanPurpose', e.target.value)} required className="p-2 border rounded" />
            </div>
          </div>

          {/* Parental / Mayka Details */}
          <div className="space-y-4">
            <h2 className="font-bold text-indigo-600 uppercase tracking-wide border-b pb-1">6. सदस्य के मायके के बारे में जानकारी (Parental Background)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="घर का पूरा पता (Mayka Address)" value={formData.parentalDetails.fullAddress} onChange={(e) => handleChange('parentalDetails', 'fullAddress', e.target.value)} required className="p-2 border rounded md:col-span-3" />
              <input type="text" placeholder="पिता का नाम" value={formData.parentalDetails.fatherName} onChange={(e) => handleChange('parentalDetails', 'fatherName', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="पिता का मोबाइल नं." value={formData.parentalDetails.fatherMobile} onChange={(e) => handleChange('parentalDetails', 'fatherMobile', e.target.value)} required className="p-2 border rounded" />
              <input type="text" placeholder="भाई का नाम" value={formData.parentalDetails.brotherName} onChange={(e) => handleChange('parentalDetails', 'brotherName', e.target.value)} className="p-2 border rounded" />
              <input type="text" placeholder="भाई का मोबाइल नं." value={formData.parentalDetails.brotherMobile} onChange={(e) => handleChange('parentalDetails', 'brotherMobile', e.target.value)} className="p-2 border rounded" />
              <input type="text" placeholder="लैंडमार्क (Landmark)" value={formData.parentalDetails.landmark} onChange={(e) => handleChange('parentalDetails', 'landmark', e.target.value)} className="p-2 border rounded" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send size={14} /> {loading ? 'Submitting...' : 'Submit LinIn Loan Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationForm;