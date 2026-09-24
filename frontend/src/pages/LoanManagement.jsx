import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoans, disburseLoan, markEmiPaid } from '../redux/slices/loanSlice';
import { fetchBorrowers } from '../redux/slices/borrowerSlice';
import { Landmark, CheckCircle2, Clock, IndianRupee } from 'lucide-react';

const LoanManagement = () => {
  const dispatch = useDispatch();
  const { data: loans, loading } = useSelector((state) => state.loans || { data: [] });
  const { data: borrowers } = useSelector((state) => state.borrowers || { data: [] });

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    borrowerId: '',
    principalAmount: '',
    annualInterestRate: 12,
    tenureMonths: 12,
  });

  useEffect(() => {
    dispatch(fetchLoans());
    dispatch(fetchBorrowers());
  }, [dispatch]);

  const handleDisburse = (e) => {
    e.preventDefault();
    if (!formData.borrowerId) return alert('Select a Borrower');
    dispatch(disburseLoan(formData)).then((res) => {
      if (!res.error) alert('Loan Disbursed Successfully!');
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Landmark className="text-indigo-600" /> Loan Disbursement & Tracking
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Disburse Form */}
        <form onSubmit={handleDisburse} className="bg-white p-6 rounded-xl border space-y-4 shadow-sm">
          <h2 className="font-semibold text-slate-800">New Loan Disbursement</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Borrower</label>
            <select
              required
              value={formData.borrowerId}
              onChange={(e) => setFormData({ ...formData, borrowerId: e.target.value })}
              className="w-full p-2 border text-sm rounded-lg"
            >
              <option value="">-- Choose Borrower --</option>
              {borrowers.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.fullName} ({b.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Principal Amount (₹)</label>
            <input
              type="number"
              required
              placeholder="e.g. 50000"
              value={formData.principalAmount}
              onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
              className="w-full p-2 border text-sm rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Interest (%)</label>
              <input
                type="number"
                value={formData.annualInterestRate}
                onChange={(e) => setFormData({ ...formData, annualInterestRate: e.target.value })}
                className="w-full p-2 border text-sm rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tenure (Months)</label>
              <input
                type="number"
                value={formData.tenureMonths}
                onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
                className="w-full p-2 border text-sm rounded-lg"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm">
            Disburse Loan
          </button>
        </form>

        {/* Active Disbursed Loans */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-slate-800">Active Disbursed Loans ({loans.length})</h2>

          <div className="space-y-3">
            {loans.map((loan) => (
              <div key={loan._id} className="bg-white p-4 border rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">{loan.borrower?.fullName || 'N/A'}</div>
                  <div className="text-xs text-slate-500">
                    Amount: ₹{loan.principalAmount} | Tenure: {loan.tenureMonths}m | Status: {loan.status}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLoan(selectedLoan?._id === loan._id ? null : loan)}
                  className="px-3 py-1.5 text-xs bg-slate-100 font-semibold rounded-lg hover:bg-slate-200"
                >
                  {selectedLoan?._id === loan._id ? 'Hide Schedule' : 'View Schedule'}
                </button>
              </div>
            ))}
          </div>

          {/* Schedule Detailed Table */}
          {selectedLoan && (
            <div className="bg-white p-4 border rounded-xl shadow-sm mt-4">
              <h3 className="font-semibold text-sm mb-3">
                Repayment Schedule - {selectedLoan.borrower?.fullName}
              </h3>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-semibold">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">EMI</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedLoan.schedule?.map((item) => (
                    <tr key={item._id}>
                      <td className="p-2">{item.installmentNo}</td>
                      <td className="p-2">{new Date(item.dueDate).toLocaleDateString()}</td>
                      <td className="p-2 font-medium">₹{item.totalPayment}</td>
                      <td className="p-2">
                        {item.status === 'PAID' ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Paid
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold flex items-center gap-1">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {item.status === 'PENDING' && (
                          <button
                            onClick={() =>
                              dispatch(
                                markEmiPaid({ loanId: selectedLoan._id, installmentId: item._id })
                              )
                            }
                            className="bg-emerald-600 text-white px-2 py-1 rounded text-[11px]"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanManagement;