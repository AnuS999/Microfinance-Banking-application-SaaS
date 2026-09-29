import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Settings, Plus, CheckCircle, Trash2, Edit3 } from 'lucide-react';

const MasterDropdowns = () => {
  const [activeTab, setActiveTab] = useState('identity'); // identity, relation, purpose, reason, centerName, etc.
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  // Categories list (Added Center Names category)
// Categories list (Center Names ko sabse upar kar diya hai)
  const categories = [
    { key: 'centername', label: 'Center Names' },
    { key: 'identity', label: 'Identity Proof Details' },
    { key: 'relation', label: 'Relation Details' },
    { key: 'purpose', label: 'Purpose Details' },
    { key: 'reason', label: 'Reason Details' },
    { key: 'designation', label: 'Employee Designations & Roles' },
    { key: 'state', label: 'States & State Codes' },
    { key: 'branch', label: 'Branch Names' }
  ];

  // Fetch options based on active tab
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/master-dropdowns?category=${activeTab}`);
      setOptions(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching master options', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  // Add new option
  const handleAddOption = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const res = await API.post('/master-dropdowns', {
        category: activeTab,
        name: newItemName.trim(),
        status: 'Active'
      });
      setOptions([...options, res.data.data || res.data]);
      setNewItemName('');
      alert('Option added successfully!');
    } catch (err) {
      console.error('Error adding option', err);
      alert('Failed to add option');
    }
  };

  // Delete option
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this option?')) return;
    try {
      await API.delete(`/master-dropdowns/${id}`);
      setOptions(options.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting option', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <Settings className="text-indigo-600" size={24} /> Master Dropdown Settings
        </h1>
        <p className="text-xs text-slate-500">Manage dynamic dropdown options for loan applications and member registration forms.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === cat.key 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Add New Form & List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Add New Option</h3>
          <form onSubmit={handleAddOption} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Option Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter new ${activeTab} name...`}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={16} /> Add to Master List
            </button>
          </form>
        </div>

        {/* List Table Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              {categories.find(c => c.key === activeTab)?.label} List
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
              {options.length} Entries
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading options...</div>
          ) : options.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No options found. Add your first entry using the form.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/50 uppercase text-[10px] tracking-wider">
                    <th className="p-3.5 px-6">Sr. No.</th>
                    <th className="p-3.5">Option Name</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {options.map((item, index) => (
                    <tr key={item._id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 px-6 font-semibold text-slate-400">{index + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {item.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right px-6">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                          title="Delete option"
                        >
                          <Trash2 size={14} />
                        </button>
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

export default MasterDropdowns;