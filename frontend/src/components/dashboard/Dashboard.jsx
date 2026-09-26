import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance'; 
import { Filter, RotateCcw, FileText, CheckCircle, IndianRupee, Clock } from 'lucide-react';

// Components Import

import DashboardCharts from './DashboardCharts';
import RecentApplications from './RecentApplications';

const Dashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('/loan-applications/all');
        setLoans(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  // Filter Logic
  const filteredLoans = loans.filter(loan => {
    if (statusFilter !== 'ALL' && (loan.disbursementStatus || 'PENDING') !== statusFilter) return false;
    if (searchDate) {
      const loanDateStr = loan.applicationDate || loan.createdAt;
      if (!loanDateStr) return false;
      if (new Date(loanDateStr).toISOString().split('T')[0] !== searchDate) return false;
    }
    return true;
  });

  // Metrics Calculations
  const totalApplications = filteredLoans.length;
  const approvedCount = filteredLoans.filter(l => l.disbursementStatus === 'APPROVED').length;
  const pendingCount = filteredLoans.filter(l => !l.disbursementStatus || l.disbursementStatus === 'PENDING').length;
  const totalLoanAmount = filteredLoans.reduce((sum, loan) => sum + (Number(loan.loanDetails?.loanAmount) || 0), 0);

  // Chart Data Preparation
  const chartData = Object.values(filteredLoans.reduce((acc, loan) => {
    const dateStr = loan.applicationDate || loan.createdAt;
    if (!dateStr) return acc;
    const month = new Date(dateStr).toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!acc[month]) acc[month] = { month, totalAmount: 0, count: 0 };
    acc[month].totalAmount += Number(loan.loanDetails?.loanAmount) || 0;
    acc[month].count += 1;
    return acc;
  }, {}));

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-indigo-600 font-medium">Loading Advanced Analytics...</div>;

  return (
    <div className="w-full px-6 py-8 space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Executive Control Panel</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time microfinance liquidity, risk metrics, and application workflow status.</p>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: FileText, title: 'New Loan', desc: 'Apply new credit', color: 'indigo', action: () => window.location.href = '/new-loan' },
          { icon: CheckCircle, title: 'LOA Records', desc: 'Manage approvals', color: 'emerald', action: () => window.location.href = '/loan-records' },
          { icon: IndianRupee, title: 'Print Report', desc: 'Export analytics', color: 'blue', action: () => window.print() },
          { icon: Clock, title: 'System Sync', desc: 'Real-time status', color: 'amber', action: () => alert('Synced!') }
        ].map((item, idx) => (
          <button key={idx} onClick={item.action} className={`p-4 bg-white hover:bg-${item.color}-50/50 border border-slate-200/80 rounded-2xl shadow-sm flex items-center gap-3.5 transition-all text-left`}>
            <div className={`p-2.5 bg-${item.color}-100 text-${item.color}-600 rounded-xl`}><item.icon size={20} /></div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{item.title}</h4>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Filter Toolbar Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Filter size={18} className="text-indigo-600" />
          <span>Filters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING">Pending Review</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
          <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
          {(statusFilter !== 'ALL' || searchDate) && (
            <button onClick={() => { setStatusFilter('ALL'); setSearchDate(''); }} className="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs flex items-center gap-1">
              <RotateCcw size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* RENDER IMPORTED COMPONENTS HERE */}
   
      <DashboardCharts chartData={chartData} />
      
      <RecentApplications filteredLoans={filteredLoans} />

    </div>
  );
};

export default Dashboard;