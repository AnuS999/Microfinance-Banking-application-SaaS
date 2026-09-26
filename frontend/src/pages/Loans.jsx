import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Landmark, Calendar, IndianRupee, CheckCircle, Clock } from 'lucide-react';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await API.get('/loan-applications/all');
        setLoans(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to fetch loans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Landmark className="text-indigo-600" size={24} /> Loan Management & Tracking
        </h1>
        <p className="text-xs text-slate-500">View active loans, repayment schedules, and current statuses</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-sm font-bold text-slate-700">Disbursed Loans List</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading loan records...</div>
        ) : loans.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No active loan records found in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Borrower</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Tenure</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Disbursed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((loan) => {
                  const currentStatus = loan.disbursementStatus || loan.status || 'PENDING';
                  const borrowerName = loan.personalDetails?.fullName || loan.memberName || loan.borrower?.name || loan.fullName || 'N/A';
                  const loanAmount = loan.loanDetails?.loanAmount || loan.principalAmount || 0;
                  const tenureMonths = loan.loanDetails?.tenureMonths || loan.tenure || loan.tenureMonths || 'N/A';

                  return (
                    <tr key={loan._id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-semibold text-slate-800">
                        {borrowerName}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        ₹{Number(loanAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {tenureMonths} Months
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          currentStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                          currentStatus === 'DISBURSED' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                          currentStatus === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-300' :
                          'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {loan.applicationDate || loan.createdAt ? new Date(loan.applicationDate || loan.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans;