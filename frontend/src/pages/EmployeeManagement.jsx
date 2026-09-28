import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { UserPlus, Save, Users } from 'lucide-react';

const EmployeeManagement = () => {
  const [formData, setFormData] = useState({
    employeeCode: '',
    fullName: '',
    email: '',
    password: '',
    role: 'Agent',
    designation: '',
    phoneNumber: '',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
    address: ''
  });

  // Default Microfinance Designations + Fallback list
  const [designations, setDesignations] = useState([
    { _id: '1', name: 'Branch Manager' },
    { _id: '2', name: 'Loan Officer' },
    { _id: '3', name: 'Field Officer' },
    { _id: '4', name: 'Cashier' },
    { _id: '5', name: 'Center Coordinator' },
    { _id: '6', name: 'Area Manager' }
  ]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await API.get('/master-dropdowns?category=designation');
        if (res.data && res.data.data && res.data.data.length > 0) {
          setDesignations(res.data.data);
        }
      } catch (err) {
        console.log('Using default microfinance designations list', err);
      }
    };
    fetchDesignations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await API.post('/employees/create', formData);
      alert(res.data.message || 'Employee registered successfully with login access!');
      
      // Form Reset
      setFormData({
        employeeCode: '',
        fullName: '',
        email: '',
        password: '',
        role: 'Agent',
        designation: '',
        phoneNumber: '',
        salary: '',
        joiningDate: new Date().toISOString().split('T')[0],
        address: ''
      });
    } catch (err) {
      console.error('Error saving employee:', err);
      // Asli error backend se nikal kar alert me dikhayega
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save employee details';
      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-100/60 min-h-screen">
      <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={20} /> Employee & Access Management
          </h1>
          <p className="text-xs text-slate-500">Register staff, assign designations, set roles (Admin/Agent) and login credentials.</p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-lg border border-indigo-100">
          HR & ADMIN
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <UserPlus size={18} className="text-emerald-600" />
          <h2 className="font-bold text-slate-800 text-sm">New Employee Registration Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Employee Code *</label>
              <input 
                type="text" 
                name="employeeCode" 
                value={formData.employeeCode} 
                onChange={handleChange} 
                placeholder="e.g. LIN001" 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Full Name *</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="Enter full name" 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Email Address (Login ID) *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="employee@company.com" 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Password *</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Set login password" 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">System Role *</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Agent">Agent / Field Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Designation *</label>
              <select 
                name="designation" 
                value={formData.designation} 
                onChange={handleChange} 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Designation</option>
                {designations.map(item => (
                  <option key={item._id || item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Phone Number *</label>
              <input 
                type="text" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                placeholder="Mobile number" 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Monthly Salary (INR) *</label>
              <input 
                type="number" 
                name="salary" 
                value={formData.salary} 
                onChange={handleChange} 
                placeholder="Salary amount" 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div>
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Date of Joining *</label>
              <input 
                type="date" 
                name="joiningDate" 
                value={formData.joiningDate} 
                onChange={handleChange} 
                required 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-bold text-slate-500 uppercase mb-1.5">Complete Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Residential address" 
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={submitting} 
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={14} /> {submitting ? 'Registering...' : 'Register Employee & Grant Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeManagement;