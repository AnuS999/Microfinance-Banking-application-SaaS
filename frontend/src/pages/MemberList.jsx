import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Users, CheckCircle, Clock, Filter } from 'lucide-react';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // Filter state

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/loan-applications/all');
      setMembers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic based on selection
  const filteredMembers = members.filter((member) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') return member.disbursementStatus === 'DISBURSED';
    if (filterStatus === 'PENDING') return member.disbursementStatus === 'PENDING';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Header & Filter Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-indigo-600" size={20} /> LinIn - Member List & Tracking
            </h1>
            <p className="text-xs text-slate-500">View and filter registered loan application members.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filterStatus === 'ACTIVE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle size={12} /> Active Members
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filterStatus === 'PENDING' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={12} /> Pending
            </button>
          </div>
        </div>

        {/* Member Table */}
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No members found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Member Name</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Mobile No</th>
                  <th className="p-3">Loan Amount</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-800">{member.memberName}</td>
                    <td className="p-3 text-slate-600">{member.branchName}</td>
                    <td className="p-3 text-slate-600">{member.mobileNumber}</td>
                    <td className="p-3 font-semibold text-indigo-600">₹{member.loanDetails?.loanAmount}</td>
                    <td className="p-3 text-slate-600">{member.loanDetails?.loanPurpose}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1 ${
                          member.disbursementStatus === 'DISBURSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : member.disbursementStatus === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
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

export default MemberList;