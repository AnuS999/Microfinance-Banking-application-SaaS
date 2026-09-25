import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axiosInstance';
import { Users, UserPlus, Send, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';

const GroupLoanGRT = () => {
  const { user } = useSelector((state) => state.auth); // Role: 'ADMIN' or 'AGENT'
  const isAdmin = user?.role === 'ADMIN';

  // Agent Form State
  const [centerName, setCenterName] = useState('');
  const [members, setMembers] = useState([
    { name: '', phone: '', address: '', aadhaarNumber: '', panNumber: '', voterIdNumber: '' }
  ]);

  // Data States
  const [pendingGroups, setPendingGroups] = useState([]);
  const [agentGroups, setAgentGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState({}); // { [memberId]: { cibilScore, status } }

  useEffect(() => {
    if (isAdmin) {
      fetchPendingGroups();
    } else {
      fetchAgentGroups();
    }
  }, [isAdmin]);

  const fetchPendingGroups = async () => {
    try {
      setLoading(true);
      const res = await API.get('/groups/pending-groups');
      setPendingGroups(res.data.data);
    } catch (err) {
      console.error('Failed to fetch pending groups', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentGroups = async () => {
    try {
      setLoading(true);
      const res = await API.get('/groups/agent-groups');
      setAgentGroups(res.data.data);
    } catch (err) {
      console.error('Failed to fetch agent groups', err);
    } finally {
      setLoading(false);
    }
  };

  // Add member row in Agent form
  const handleAddMemberRow = () => {
    setMembers([...members, { name: '', phone: '', address: '', aadhaarNumber: '', panNumber: '', voterIdNumber: '' }]);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleRemoveMemberRow = (index) => {
    if (members.length === 1) return;
    setMembers(members.filter((_, i) => i !== index));
  };

  // Agent submits group for approval
  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    if (!centerName.trim()) {
      alert('Please enter Center Name or Location');
      return;
    }

    try {
      setLoading(true);
      const formattedMembers = members.map(m => ({
        name: m.name,
        phone: m.phone,
        address: m.address,
        kycDocuments: {
          aadhaarNumber: m.aadhaarNumber,
          panNumber: m.panNumber,
          voterIdNumber: m.voterIdNumber
        }
      }));

      await API.post('/groups/submit-group', {
        centerNameOrLocation: centerName,
        members: formattedMembers
      });

      alert('Group loan application submitted successfully for CIBIL verification!');
      setCenterName('');
      setMembers([{ name: '', phone: '', address: '', aadhaarNumber: '', panNumber: '', voterIdNumber: '' }]);
      fetchAgentGroups(); // Refresh agent list
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  // Admin updates local review state for a member
  const handleReviewChange = (memberId, field, value) => {
    setReviewData(prev => ({
      ...prev,
      [memberId]: {
        ...(prev[memberId] || { cibilScore: '', status: 'APPROVED' }),
        [field]: value
      }
    }));
  };

  // Admin submits CIBIL review
  const handleAdminReviewSubmit = async (groupId, groupMembers) => {
    try {
      const memberReviews = groupMembers.map(m => {
        const review = reviewData[m._id] || {};
        return {
          memberId: m._id,
          cibilScore: Number(review.cibilScore || 700),
          status: review.status || 'APPROVED'
        };
      });

      await API.put(`/groups/review-group/${groupId}`, { memberReviews });
      alert('CIBIL review processed successfully!');
      fetchPendingGroups();
    } catch (err) {
      alert('Failed to process review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={24} /> Group Loan & KYC Verification (GRT)
          </h1>
          <p className="text-xs text-slate-500">
            Role: <span className="font-semibold text-indigo-600 uppercase">{user?.role || 'AGENT'}</span>
          </p>
        </div>
      </div>

      {/* AGENT VIEW: Form & Submitted Status Tracker */}
      {!isAdmin && (
        <div className="space-y-8">
          {/* Submission Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Create New Group Registration</h2>
              <p className="text-xs text-slate-500">Enter center location and member KYC details for CIBIL background check.</p>
            </div>

            <form onSubmit={handleGroupSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Center Name / Location</label>
                <input
                  type="text"
                  placeholder="e.g., Sector 62 Center, Noida"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  required
                  className="w-full md:w-1/3 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-700 uppercase">Group Members KYC List</h3>
                  <button
                    type="button"
                    onClick={handleAddMemberRow}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <UserPlus size={14} /> Add Member
                  </button>
                </div>

                {members.map((member, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-600">Member #{index + 1}</span>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberRow(index)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        required
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        required
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={member.address}
                        onChange={(e) => handleMemberChange(index, 'address', e.target.value)}
                        required
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Aadhaar Number"
                        value={member.aadhaarNumber}
                        onChange={(e) => handleMemberChange(index, 'aadhaarNumber', e.target.value)}
                        required
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="PAN Number"
                        value={member.panNumber}
                        onChange={(e) => handleMemberChange(index, 'panNumber', e.target.value)}
                        required
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Voter ID Number"
                        value={member.voterIdNumber}
                        onChange={(e) => handleMemberChange(index, 'voterIdNumber', e.target.value)}
                        required
                        className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send size={14} /> {loading ? 'Submitting...' : 'Submit Group for CIBIL Verification'}
              </button>
            </form>
          </div>

          {/* Agent Tracker Section: Live Status & Date-Time */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">My Submitted Groups Tracking</h2>
                <p className="text-xs text-slate-500">Real-time status updates and decision timestamps by Admin.</p>
              </div>
              <button 
                onClick={fetchAgentGroups}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
              >
                Refresh Status
              </button>
            </div>

            {agentGroups.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                You haven't submitted any group applications yet.
              </div>
            ) : (
              <div className="space-y-4">
                {agentGroups.map((group) => {
                  const statusColors = {
                    PENDING_APPROVAL: 'bg-amber-50 text-amber-600 border-amber-200',
                    APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                    REJECTED: 'bg-rose-50 text-rose-600 border-rose-200',
                  };

                  return (
                    <div key={group._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">Center: {group.centerNameOrLocation}</h3>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> Last Updated: {new Date(group.updatedAt).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase ${statusColors[group.groupStatus] || 'bg-slate-100 text-slate-600'}`}>
                          {group.groupStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                        {group.members.map((m, idx) => (
                          <div key={m._id || idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                            <div className="flex justify-between font-bold text-slate-700">
                              <span>{m.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                m.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {m.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">Phone: {m.phone}</div>
                            <div className="text-[11px] text-slate-500">CIBIL Score: <span className="font-semibold text-slate-700">{m.cibilScore || 'Pending'}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN VIEW: Review Pending Groups & CIBIL */}
      {isAdmin && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Pending Group CIBIL Approvals</h2>
          
          {pendingGroups.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No pending group loan applications found.
            </div>
          ) : (
            pendingGroups.map((group) => (
              <div key={group._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Center: {group.centerNameOrLocation}</h3>
                    <p className="text-xs text-slate-400">Agent ID: {group.agent?.name || group.agent}</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-bold">
                    Pending CIBIL Review
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Member Name</th>
                        <th className="p-3">Phone & Address</th>
                        <th className="p-3">KYC Docs</th>
                        <th className="p-3">CIBIL Score</th>
                        <th className="p-3">Action Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {group.members.map((m) => (
                        <tr key={m._id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-700">{m.name}</td>
                          <td className="p-3 text-slate-600">
                            <div>{m.phone}</div>
                            <div className="text-[10px] text-slate-400">{m.address}</div>
                          </td>
                          <td className="p-3 text-[11px] text-slate-600">
                            <div>Aadhaar: {m.kycDocuments?.aadhaarNumber}</div>
                            <div>PAN: {m.kycDocuments?.panNumber}</div>
                            <div>Voter: {m.kycDocuments?.voterIdNumber}</div>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              placeholder="e.g., 750"
                              value={reviewData[m._id]?.cibilScore || ''}
                              onChange={(e) => handleReviewChange(m._id, 'cibilScore', e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-300 rounded text-xs bg-white"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={reviewData[m._id]?.status || 'APPROVED'}
                              onChange={(e) => handleReviewChange(m._id, 'status', e.target.value)}
                              className="px-2 py-1 border border-slate-300 rounded text-xs bg-white font-semibold"
                            >
                              <option value="APPROVED">Approve</option>
                              <option value="REJECTED">Reject</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleAdminReviewSubmit(group._id, group.members)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                  >
                    Save & Submit Group CIBIL Decision
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroupLoanGRT;