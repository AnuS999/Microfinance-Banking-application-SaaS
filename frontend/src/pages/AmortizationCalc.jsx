import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axiosInstance';
import { Calculator, ShieldCheck, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AmortizationCalc = () => {
  const { user } = useSelector((state) => state.auth); // Logged in user data (contains role: 'ADMIN' or 'AGENT')
  
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(15);
  const [frequency, setFrequency] = useState('weekly');
  const [tenure, setTenure] = useState(25);
  const [fileCharge, setFileCharge] = useState(1500);
  const [insuranceCharge, setInsuranceCharge] = useState(1000);

  const [schedule, setSchedule] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingPeriod, setLoadingPeriod] = useState(null);

  const calculateSchedule = (e) => {
    e.preventDefault();
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate) / 100;
    const periods = parseInt(tenure);
    const totalExtraCharges = (parseFloat(fileCharge) || 0) + (parseFloat(insuranceCharge) || 0);

    const totalPrincipalForCalc = principal + totalExtraCharges;
    const periodRate = annualRate / (frequency === 'weekly' ? 52 : 12);
    const installment = (totalPrincipalForCalc * periodRate * Math.pow(1 + periodRate, periods)) / 
                        (Math.pow(1 + periodRate, periods) - 1);

    let balance = totalPrincipalForCalc;
    const newSchedule = [];
    let totalInterestPaid = 0;
    const startDate = new Date();

    for (let i = 1; i <= periods; i++) {
      const interestPayment = balance * periodRate;
      const principalPayment = installment - interestPayment;
      balance -= principalPayment;
      totalInterestPaid += interestPayment;

      const dueDate = new Date(startDate);
      if (frequency === 'weekly') dueDate.setDate(dueDate.getDate() + (i * 7));
      else dueDate.setMonth(dueDate.getMonth() + i);

      newSchedule.push({
        period: i,
        installment: Math.round(installment),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.max(0, Math.round(balance)),
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'PENDING',
        collectedAt: null
      });
    }

    setSchedule(newSchedule);
    setSummary({
      totalPayable: Math.round(installment * periods),
      totalInterest: Math.round(totalInterestPaid)
    });
  };

  // Agent action: Request Collection
  const handleRequestCollection = async (periodIndex) => {
    try {
      setLoadingPeriod(periodIndex);
      // API call: await API.post('/loans/request-collection', { period: periodIndex });

      setSchedule(schedule.map(item => 
        item.period === periodIndex ? { ...item, status: 'PENDING_APPROVAL' } : item
      ));
    } catch (err) {
      alert('Failed to submit collection request');
    } finally {
      setLoadingPeriod(null);
    }
  };

  // Admin action: Approve
  const handleAdminApprove = async (periodIndex) => {
    try {
      setLoadingPeriod(periodIndex);
      // API call: await API.post('/loans/approve-collection', { period: periodIndex });

      const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
      setSchedule(schedule.map(item => 
        item.period === periodIndex ? { ...item, status: 'COLLECTED', collectedAt: timestamp } : item
      ));
    } catch (err) {
      alert('Approval failed');
    } finally {
      setLoadingPeriod(null);
    }
  };

  // Admin action: Reject (Reverts to PENDING)
  const handleAdminReject = async (periodIndex) => {
    try {
      setLoadingPeriod(periodIndex);
      // API call: await API.post('/loans/reject-collection', { period: periodIndex });

      setSchedule(schedule.map(item => 
        item.period === periodIndex ? { ...item, status: 'PENDING', collectedAt: null } : item
      ));
    } catch (err) {
      alert('Rejection failed');
    } finally {
      setLoadingPeriod(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-indigo-600" size={24} /> Amortization & RBAC Collections
          </h1>
          <p className="text-xs text-slate-500">Logged in as: <span className="font-semibold text-indigo-600">{user?.role || 'AGENT'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-800 uppercase">Loan Parameters</h2>
          <form onSubmit={calculateSchedule} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">File Charge (₹)</label>
                <input type="number" value={fileCharge} onChange={(e) => setFileCharge(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance (₹)</label>
                <input type="number" value={insuranceCharge} onChange={(e) => setInsuranceCharge(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
              <select value={frequency} onChange={(e) => { setFrequency(e.target.value); setTenure(e.target.value === 'weekly' ? 25 : 12); }} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
                <option value="weekly">Weekly (25 Weeks)</option>
                <option value="monthly">Monthly (12 Months)</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors">
              Generate Schedule
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700">Repayment & Approval Queue</h2>
          </div>

          {schedule.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">Generate schedule to view actions.</div>
          ) : (
            <div className="overflow-x-auto max-h-[450px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                  <tr>
                    <th className="p-3">Period</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Installment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-700">{frequency === 'weekly' ? 'Week' : 'Month'} {row.period}</td>
                      <td className="p-3 text-slate-600">{row.dueDate}</td>
                      <td className="p-3 font-bold text-slate-900">₹{row.installment.toLocaleString()}</td>
                      <td className="p-3">
                        {row.status === 'PENDING' && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded font-bold text-[10px]">Pending</span>}
                        {row.status === 'PENDING_APPROVAL' && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded font-bold text-[10px]">Pending Approval</span>}
                        {row.status === 'COLLECTED' && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded font-bold text-[10px]">Collected ({row.collectedAt})</span>}
                      </td>
                      <td className="p-3 text-right">
                        {/* AGENT VIEW: Can only request collection if status is PENDING */}
                        {user?.role !== 'ADMIN' && row.status === 'PENDING' && (
                          <button onClick={() => handleRequestCollection(row.period)} disabled={loadingPeriod === row.period} className="px-3 py-1 bg-indigo-600 text-white rounded font-semibold text-[11px]">
                            Collect EMI
                          </button>
                        )}
                        {user?.role !== 'ADMIN' && row.status === 'PENDING_APPROVAL' && (
                          <span className="text-xs text-blue-600 font-medium">Waiting Admin Review</span>
                        )}

                        {/* ADMIN VIEW: Can Approve or Reject when status is PENDING_APPROVAL */}
                        {user?.role === 'ADMIN' && row.status === 'PENDING_APPROVAL' && (
                          <div className="flex justify-end gap-1">
                            <button onClick={() => handleAdminApprove(row.period)} className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">Approve</button>
                            <button onClick={() => handleAdminReject(row.period)} className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold">Reject</button>
                          </div>
                        )}
                        {user?.role === 'ADMIN' && row.status === 'PENDING' && (
                          <span className="text-xs text-slate-400">Agent Action Pending</span>
                        )}

                        {row.status === 'COLLECTED' && <span className="text-xs text-slate-400 font-medium">Done</span>}
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

export default AmortizationCalc;