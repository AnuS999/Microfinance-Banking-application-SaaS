import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateAmortization } from '../utils/amortization';
import { Calculator, Calendar, DollarSign, Percent } from 'lucide-react';

const AmortizationCalculator = () => {
  const [formData, setFormData] = useState({
    amount: 100000,
    interestRate: 12,
    tenureMonths: 12,
    startDate: new Date().toISOString().split('T')[0]
  });

  const dispatch = useDispatch();
  const { calculationResult, loading } = useSelector((state) => state.loans);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateAmortization(formData));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Calculator className="text-indigo-600" /> Loan Amortization Engine
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Loan Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Tenure (Months)</label>
            <input
              type="number"
              value={formData.tenureMonths}
              onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Calculating...' : 'Generate Repayment Schedule'}
          </button>
        </form>

        {/* Schedule & Summary Output */}
        <div className="lg:col-span-2 space-y-6">
          {calculationResult && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 text-white p-4 rounded-xl">
                  <p className="text-xs text-slate-400">Monthly EMI</p>
                  <p className="text-xl font-bold mt-1">₹{calculationResult.summary.monthlyEmi.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-medium">Total Interest</p>
                  <p className="text-xl font-bold text-indigo-900 mt-1">₹{calculationResult.summary.totalInterest.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-medium">Total Payable</p>
                  <p className="text-xl font-bold text-emerald-900 mt-1">₹{calculationResult.summary.totalPayable.toLocaleString()}</p>
                </div>
              </div>

              {/* Repayment Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Principal</th>
                      <th className="p-3">Interest</th>
                      <th className="p-3">Total EMI</th>
                      <th className="p-3">Balance</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculationResult.schedule.map((row) => (
                      <tr key={row.installmentNo} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{row.installmentNo}</td>
                        <td className="p-3">{row.dueDate}</td>
                        <td className="p-3">₹{row.principalAmount.toLocaleString()}</td>
                        <td className="p-3">₹{row.interestAmount.toLocaleString()}</td>
                        <td className="p-3 font-semibold text-slate-800">₹{row.totalEmi.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">₹{row.remainingBalance.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmortizationCalculator;