import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { FileText, Users, Calendar, Shield, IndianRupee, CheckCircle, Clock } from 'lucide-react';

const MemberLog = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembersLog();
  }, []);

  const fetchMembersLog = async () => {
    try {
      setLoading(true);
      const res = await API.get('/loan-applications/all');
      setMembers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch members log', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-indigo-600" size={20} /> Member All Activity & Loan Logs
            </h1>
            <p className="text-xs text-slate-500">Complete log of all registered members, Aadhaar, center name, amount, and pending EMIs.</p>
          </div>
          <div className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold border border-indigo-100">
            Total Logs: {members.length}
          </div>
        </div>

        {/* Table Data */}
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading logs...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No member logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Member Name & Aadhaar</th>
                  <th className="p-3">Center / Village</th>
                  <th className="p-3">Loan Amount</th>
                  <th className="p-3">Disbursement Date</th>
                  <th className="p-3">Pending EMI Status</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{member.memberName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Shield size={10} className="text-indigo-500" /> 
                        Aadhaar: {member.kycAndBank?.memberAadhaarNumber || member.guarantor?.aadhaarNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-700">{member.branchName || 'Main Branch'}</div>
                      <div className="text-[10px] text-slate-400">Center: {member.address?.village || 'N/A'}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-indigo-600 flex items-center gap-0.5">
                        <IndianRupee size={12} /> {member.loanDetails?.loanAmount || 0}
                      </div>
                      <div className="text-[10px] text-slate-400">{member.loanDetails?.loanPurpose}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-700 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {member.disbursementDate ? new Date(member.disbursementDate).toLocaleDateString() : (member.applicationDate || 'N/A')}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-amber-600">
                        {member.pendingEmis ?? '0'} EMIs Pending
                      </div>
                      <div className="text-[10px] text-slate-400">Tenure: {member.loanDetails?.tenureOrCycle || '50 Weeks'}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-md font-bold text-[10px] inline-flex items-center gap-1 ${
                          member.disbursementStatus === 'DISBURSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {member.disbursementStatus === 'DISBURSED' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {member.disbursementStatus || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberLog;