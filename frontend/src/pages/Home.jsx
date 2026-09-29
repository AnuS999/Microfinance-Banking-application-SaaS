import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import { Landmark, Users, IndianRupee, ArrowUpRight, ClockCheck, TrendingUp } from 'lucide-react';

const Home = () => {
  const [metrics, setMetrics] = useState({
    totalBorrowers: 0,
    activeLoansCount: 0,
    totalDisbursed: 0,
    totalCollected: 0,
    totalPending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await API.get('/analytics/dashboard');
        setMetrics(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const recoveryRate = metrics.totalDisbursed > 0
    ? Math.round((metrics.totalCollected / (metrics.totalCollected + metrics.totalPending)) * 100) || 0
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Executive Overview</h1>
        <p className="text-sm text-slate-500">Real-time portfolio metrics & collection performance</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Disbursed</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Landmark size={18} /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{metrics.totalDisbursed.toLocaleString()}</div>
          <p className="text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12} className="text-emerald-500"/> Capital deployed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collected</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><IndianRupee size={18} /></div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">₹{metrics.totalCollected.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 font-medium">{recoveryRate}% Recovery Rate</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Recovery</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ClockCheck size={18} /></div>
          </div>
          <div className="text-2xl font-bold text-amber-700">₹{metrics.totalPending.toLocaleString()}</div>
          <p className="text-xs text-slate-500">Outstanding EMIs</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Borrowers</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18} /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.totalBorrowers}</div>
          <p className="text-xs text-slate-500">{metrics.activeLoansCount} Active Loans</p>
        </div>
      </div>

      {/* Collection Progress Overview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-semibold text-slate-800 text-base">Portfolio Health Bar</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Collected: ₹{metrics.totalCollected.toLocaleString()}</span>
            <span>Pending: ₹{metrics.totalPending.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${recoveryRate}%` }}
              className="bg-emerald-500 transition-all duration-500"
            />
            <div
              style={{ width: `${100 - recoveryRate}%` }}
              className="bg-amber-400 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;