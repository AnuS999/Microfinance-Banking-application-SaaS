import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { UserPlus, Save } from 'lucide-react';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    designation: '',
    salary: '',
    mobileNumber: '',
    state: '',
    branchName: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Master options fetch karna
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [desRes, stateRes, branchRes] = await Promise.all([
          API.get('/master-dropdowns?category=designation').catch(() => ({ data: [] })),
          API.get('/master-dropdowns?category=state').catch(() => ({ data: [] })),
          API.get('/master-dropdowns?category=branch').catch(() => ({ data: [] }))
        ]);

        setDesignations(desRes.data.data || desRes.data || []);
        setStates(stateRes.data.data || stateRes.data || []);
        setBranches(branchRes.data.data || branchRes.data || []);
      } catch (err) {
        console.error('Error fetching employee dropdown options', err);
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post('/employees/create', formData);
      alert('Employee details submitted successfully!');
      setFormData({
        employeeName: '',
        designation: '',
        salary: '',
        mobileNumber: '',
        state: '',
        branchName: '',
        joiningDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save employee details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="text-indigo-600" size={22} /> Employee Registration & Salary Master
          </h1>
          <p className="text-xs text-slate-500">Add staff details, assign roles, salary structure, state, and branch mapping.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">Employee Name</label>
              <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="Enter full name" required className="w-full p-2.5 border rounded-xl bg-slate-50" />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">Designation / Role</label>
              <select name="designation" value={formData.designation} onChange={handleChange} required className="w-full p-2.5 border rounded-xl bg-white">
                <option value="">Select Designation</option>
                {designations.map(item => (
                  <option key={item._id || item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">Monthly Salary (INR)</label>
              <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Enter salary amount" required className="w-full p-2.5 border rounded-xl bg-slate-50" />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
              <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile number" required className="w-full p-2.5 border rounded-xl bg-slate-50" />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">State (with Code)</label>
              <select name="state" value={formData.state} onChange={handleChange} required className="w-full p-2.5 border rounded-xl bg-white">
                <option value="">Select State</option>
                {states.map(item => (
                  <option key={item._id || item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1">Branch Name</label>
              <select name="branchName" value={formData.branchName} onChange={handleChange} required className="w-full p-2.5 border rounded-xl bg-white">
                <option value="">Select Branch</option>
                {branches.map(item => (
                  <option key={item._id || item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all">
              <Save size={14} /> {loading ? 'Saving...' : 'Save Employee Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;