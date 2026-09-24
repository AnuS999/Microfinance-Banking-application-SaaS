import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBorrowers, addBorrower, deleteBorrower } from '../redux/slices/borrowerSlice';
import { UserPlus, Users, Trash2, Phone, CreditCard, FileCheck } from 'lucide-react';

const BorrowerManagement = () => {
  const dispatch = useDispatch();
  const { data: borrowers, loading } = useSelector((state) => state.borrowers || { data: [] });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    aadhaarNumber: '',
    panNumber: '',
    address: { street: '', city: '', state: '', pincode: '' }
  });

  useEffect(() => {
    dispatch(fetchBorrowers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBorrower(formData)).then((res) => {
      if (!res.error) {
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          aadhaarNumber: '',
          panNumber: '',
          address: { street: '', city: '', state: '', pincode: '' }
        });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" /> Borrower Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Register and manage loan applicants/borrowers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Borrower Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <UserPlus size={18} className="text-indigo-600" /> Add New Borrower
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="rahul@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Aadhaar Number</label>
              <input
                type="text"
                required
                placeholder="12-digit number"
                value={formData.aadhaarNumber}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">PAN Number</label>
              <input
                type="text"
                required
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            Register Borrower
          </button>
        </form>

        {/* Borrower List Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b font-semibold text-slate-700 text-sm">
            Registered Borrowers ({borrowers.length})
          </div>

          {loading ? (
            <p className="p-6 text-slate-500 text-sm">Loading borrowers list...</p>
          ) : borrowers.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm text-center">No borrowers registered yet.</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b text-xs">
                <tr>
                  <th className="p-3">Borrower Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">KYC (Aadhaar / PAN)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {borrowers.map((borrower) => (
                  <tr key={borrower._id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{borrower.fullName}</td>
                    <td className="p-3 text-xs">
                      <div className="flex items-center gap-1 text-slate-700"><Phone size={12}/> {borrower.phone}</div>
                    </td>
                    <td className="p-3 text-xs space-y-0.5">
                      <div className="text-slate-600 font-mono">Aadhaar: {borrower.aadhaarNumber}</div>
                      <div className="text-slate-500 font-mono">PAN: {borrower.panNumber}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        {borrower.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => dispatch(deleteBorrower(borrower._id))}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowerManagement;