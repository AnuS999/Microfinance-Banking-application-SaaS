import React from 'react';
import { FileText, CheckCircle, Clock, IndianRupee } from 'lucide-react';

const DashboardStats = ({ totalApplications, approvedCount, pendingCount, totalLoanAmount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Applications</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">{totalApplications}</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={22} /></div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-emerald-600 uppercase">Approved Loans</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">{approvedCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={22} /></div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-amber-600 uppercase">Pending Review</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">{pendingCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={22} /></div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">Total Disbursed Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">₹{totalLoanAmount.toLocaleString('en-IN')}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><IndianRupee size={22} /></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;