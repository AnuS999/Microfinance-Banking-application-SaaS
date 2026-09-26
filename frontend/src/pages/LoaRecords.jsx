import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Search, Calendar, Printer, ShieldCheck, FileText, CheckCircle, Clock, IndianRupee } from 'lucide-react';

const LoaRecords = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchLoanApplications();
  }, []);

  useEffect(() => {
    let result = loans;

    // Search by Name or Phone
    if (searchTerm) {
      result = result.filter(item => 
        (item.memberName || item.name || item.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.mobileNumber || item.mobileNo || item.mobile || item.phone || '').includes(searchTerm)
      );
    }

    // Filter by Date
    if (selectedDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.applicationDate || item.createdAt || Date.now()).toISOString().split('T')[0];
        return itemDate === selectedDate;
      });
    }

    setFilteredLoans(result);
  }, [searchTerm, selectedDate, loans]);

  const fetchLoanApplications = async () => {
    try {
      const res = await API.get('/loan-applications/all');
      const data = res.data.data || res.data || [];
      console.log("Fetched Loan Data:", data);
      setLoans(data);
      setFilteredLoans(data);
    } catch (err) {
      console.error('Error fetching loan applications', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format address safely
  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    if (typeof addr === 'object') {
      return [addr.village, addr.post, addr.policeStation, addr.district, addr.state]
        .filter(Boolean)
        .join(', ') || JSON.stringify(addr);
    }
    return addr;
  };

  // Helper to extract text safely from strings or objects
  const getVal = (val, fallback = 'N/A') => {
    if (val === undefined || val === null || val === '') return fallback;
    if (typeof val === 'object') {
      return val.name || val.title || val.bankName || val.accountNo || val.accountNumber || val.ifsc || JSON.stringify(val);
    }
    return val;
  };

  // Print Complete LOA Form Function
  const handlePrintLOA = (loan) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>LOA Form - ${getVal(loan.memberName, 'Member')}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; font-size: 12px; }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 15px; }
            .header h1 { margin: 0; color: #4f46e5; font-size: 18px; text-transform: uppercase; }
            .header p { margin: 3px 0; font-size: 11px; color: #555; }
            .section-title { background: #f3f4f6; padding: 5px 8px; font-weight: bold; font-size: 12px; margin-top: 12px; border-left: 4px solid #4f46e5; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
            .field-box { padding: 3px 0; border-bottom: 1px dotted #e2e8f0; }
            .label { font-weight: bold; color: #475569; }
            .value { color: #0f172a; }
            .footer { margin-top: 35px; display: flex; justify-content: space-between; font-size: 11px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LIN IN MICROCARE FOUNDATION</h1>
            <p>आपका भरोसा, हमारी पहचान</p>
            <p><strong>LOAN APPLICATION (LOA) FORM - OFFICIAL RECORD</strong></p>
          </div>

          <div class="section-title">1. Branch & Center Details</div>
          <div class="grid-2">
            <div class="field-box"><span class="label">Branch Name:</span> <span class="value">${getVal(loan.branchName)}</span></div>
            <div class="field-box"><span class="label">Member Number:</span> <span class="value">${getVal(loan.memberNumber)}</span></div>
          </div>

          <div class="section-title">2. Personal Information</div>
          <div class="grid">
            <div class="field-box"><span class="label">Member Name:</span> <span class="value">${getVal(loan.memberName)}</span></div>
            <div class="field-box"><span class="label">Husband / Father Name:</span> <span class="value">${getVal(loan.husbandName || loan.fathersName)}</span></div>
            <div class="field-box"><span class="label">Mobile No:</span> <span class="value">${getVal(loan.mobileNumber)}</span></div>
            <div class="field-box"><span class="label">Aadhaar No:</span> <span class="value">[Aadhaar Redacted]</span></div>
            <div class="field-box"><span class="label">Voter Card No:</span> <span class="value">${getVal(loan.kycAndBank?.memberVoterCardNo)}</span></div>
            <div class="field-box"><span class="label">Date of Birth:</span> <span class="value">${getVal(loan.dateOfBirth)}</span></div>
            <div class="field-box"><span class="label">Age:</span> <span class="value">${getVal(loan.age)}</span></div>
            <div class="field-box"><span class="label">Ration Card No:</span> <span class="value">${getVal(loan.kycAndBank?.rationCardNo)}</span></div>
          </div>

          <div class="section-title">3. Address Details</div>
          <div class="grid-2">
            <div class="field-box"><span class="label">Residential Address:</span> <span class="value">${formatAddress(loan.address)}</span></div>
            <div class="field-box"><span class="label">Police Station / Post:</span> <span class="value">${getVal(loan.address?.policeStation)} / ${getVal(loan.address?.post)}</span></div>
          </div>

          <div class="section-title">4. Loan Specifications</div>
          <div class="grid">
            <div class="field-box"><span class="label">Requested Amount:</span> <span class="value">Rs. ${getVal(loan.loanDetails?.loanAmount, '0')}</span></div>
            <div class="field-box"><span class="label">Loan Purpose:</span> <span class="value">${getVal(loan.loanDetails?.loanPurpose)}</span></div>
            <div class="field-box"><span class="label">Tenure / Cycle:</span> <span class="value">${getVal(loan.loanDetails?.tenureOrCycle, '50')} Weeks</span></div>
            <div class="field-box"><span class="label">Application Status:</span> <span class="value">${getVal(loan.disbursementStatus, 'PENDING')}</span></div>
            <div class="field-box"><span class="label">Application Date:</span> <span class="value">${loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString() : 'N/A'}</span></div>
          </div>

          <div class="section-title">5. Bank & Guarantor Details</div>
          <div class="grid">
            <div class="field-box"><span class="label">Bank Name:</span> <span class="value">${getVal(loan.kycAndBank?.bankName)}</span></div>
            <div class="field-box"><span class="label">Account Number:</span> <span class="value">${getVal(loan.kycAndBank?.accountNumber)}</span></div>
            <div class="field-box"><span class="label">IFSC Code:</span> <span class="value">${getVal(loan.kycAndBank?.ifscCode)}</span></div>
            <div class="field-box"><span class="label">Guarantor Name:</span> <span class="value">${getVal(loan.guarantor?.name)}</span></div>
            <div class="field-box"><span class="label">Guarantor Relation:</span> <span class="value">${getVal(loan.guarantor?.relationWithMember)}</span></div>
            <div class="field-box"><span class="label">Guarantor Voter No:</span> <span class="value">${getVal(loan.guarantor?.voterCardNo)}</span></div>
          </div>

          <div class="footer">
            <div>
              <br/><br/>
              ____________________________________<br/>
              <strong>Applicant Signature</strong>
            </div>
            <div>
              <br/><br/>
              ____________________________________<br/>
              <strong>Field Officer / Verifier Signature</strong>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle Loan Status Update (Approve / Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const confirmAction = window.confirm(`Are you sure you want to mark this loan as ${newStatus}?`);
      if (!confirmAction) return;

      // API call to update status (adjust endpoint according to your backend route)
      await API.put(`/loan-applications/status/${id}`, { disbursementStatus: newStatus });

      // Update local state so UI updates instantly without reloading
      setLoans(prevLoans =>
        prevLoans.map(loan =>
          loan._id === id ? { ...loan, disbursementStatus: newStatus } : loan
        )
      );
      
      alert(`Loan application successfully marked as ${newStatus}!`);
    } catch (err) {
      console.error('Error updating loan status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Get logged-in user info to check role
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const isAdmin = userInfo?.role?.toLowerCase() === 'admin';

  // Calculate Summary Metrics dynamically based on loaded loans
  const totalApplications = loans.length;
  const approvedCount = loans.filter(l => l.disbursementStatus === 'APPROVED').length;
  const rejectedCount = loans.filter(l => l.disbursementStatus === 'REJECTED').length;
  const pendingCount = loans.filter(l => !l.disbursementStatus || l.disbursementStatus === 'PENDING').length;
  
  const totalLoanAmount = loans.reduce((sum, loan) => sum + (Number(loan.loanDetails?.loanAmount) || 0), 0);

 return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              LOA Records, Date Filter & Print
            </h1>
            <p className="text-xs text-slate-500">View all submitted loan application forms, filter by date, and print official copies.</p>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Applications Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Applications</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{totalApplications}</h3>
            </div>
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg">
              <FileText size={20} />
            </div>
          </div>

          {/* Approved Card */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase">Approved Loans</p>
              <h3 className="text-xl font-bold text-emerald-700 mt-1">{approvedCount}</h3>
            </div>
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-amber-600 uppercase">Pending Review</p>
              <h3 className="text-xl font-bold text-amber-700 mt-1">{pendingCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
              <Clock size={20} />
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-blue-600 uppercase">Total Loan Value</p>
              <h3 className="text-lg font-bold text-blue-700 mt-1">₹{totalLoanAmount.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
              <IndianRupee size={20} />
            </div>
          </div>

        </div>

        {/* Filters Section */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by Member Name or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-600"
            />
          </div>

          <div>
            <button
              onClick={() => { setSearchTerm(''); setSelectedDate(''); }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-3">Member Name</th>
                <th className="p-3">Mobile No</th>
                <th className="p-3">Branch / Center</th>
                <th className="p-3">Loan Amount</th>
                <th className="p-3">Submitted Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">Loading records...</td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">No loan applications found.</td>
                </tr>
              ) : (
                filteredLoans.map((loan, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{loan.memberName || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{loan.mobileNumber || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{loan.branchName || 'N/A'}</td>
                    <td className="p-3 font-bold text-indigo-600">₹{loan.loanDetails?.loanAmount || 0}</td>
                    <td className="p-3 text-slate-600">{loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString() : new Date(loan.createdAt || Date.now()).toLocaleDateString()}</td>
                    
                    {/* Dynamic Status Badge */}
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1 border ${
                        loan.disbursementStatus === 'APPROVED' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : loan.disbursementStatus === 'REJECTED' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <ShieldCheck size={10} /> {loan.disbursementStatus || 'PENDING'}
                      </span>
                    </td>

                    {/* Action Buttons: Print + Approve/Reject */}
                  {/* Action Column inside table map */}
<td className="p-3 flex items-center gap-1.5 flex-wrap">
  <button
    onClick={() => handlePrintLOA(loan)}
    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold transition-colors flex items-center gap-1 shadow-sm"
  >
    <Printer size={12} /> Print
  </button>

  {/* Check if loan is PENDING */}
  {loan.disbursementStatus === 'PENDING' && (
    isAdmin ? (
      /* If Admin: Show Approve & Reject Buttons */
      <>
        <button
          onClick={() => handleStatusUpdate(loan._id, 'APPROVED')}
          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold transition-colors shadow-sm"
        >
          Approve
        </button>
        <button
          onClick={() => handleStatusUpdate(loan._id, 'REJECTED')}
          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-semibold transition-colors shadow-sm"
        >
          Reject
        </button>
      </>
    ) : (
      /* If Agent: Show Review Text Only */
      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-medium border border-slate-200">
        Pending for Admin Review
      </span>
    )
  )}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LoaRecords;