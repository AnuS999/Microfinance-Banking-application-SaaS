import React from 'react';

const RecentApplications = ({ filteredLoans }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-wide text-slate-800 uppercase">Recent Loan Applications</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest field submissions requiring review or tracking</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
          Showing Last {Math.min(filteredLoans.length, 5)} Entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-6">Member Name</th>
              <th className="py-3 px-6">Mobile No</th>
              <th className="py-3 px-6">Branch / Center</th>
              <th className="py-3 px-6">Loan Amount</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredLoans.slice(0, 5).length > 0 ? (
              filteredLoans.slice(0, 5).map((loan) => {
                const status = loan.disbursementStatus || 'PENDING';
                return (
                  <tr key={loan._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900">{loan.personalDetails?.fullName || loan.memberName || 'N/A'}</td>
                    <td className="py-3.5 px-6 text-slate-600">{loan.personalDetails?.mobileNumber || loan.mobileNo || 'N/A'}</td>
                    <td className="py-3.5 px-6 text-slate-600">{loan.centerDetails?.branchName || loan.branch || 'N/A'}</td>
                    <td className="py-3.5 px-6 font-bold text-indigo-600">₹{(Number(loan.loanDetails?.loanAmount) || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No loan applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplications;