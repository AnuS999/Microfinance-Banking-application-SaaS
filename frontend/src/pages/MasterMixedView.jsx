import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Plus, Search, X } from 'lucide-react';

const MasterMixedView = () => {
  const [data, setData] = useState({
    identity: [],
    relation: [],
    purpose: [],
    reason: []
  });

  const [searchQuery, setSearchQuery] = useState({
    identity: '',
    relation: '',
    purpose: '',
    reason: ''
  });

  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAllMasters = async () => {
    try {
      setLoading(true);
      const [idRes, relRes, purRes, reaRes] = await Promise.all([
        API.get('/master-dropdowns?category=identity').catch(() => ({ data: { data: [] } })),
        API.get('/master-dropdowns?category=relation').catch(() => ({ data: { data: [] } })),
        API.get('/master-dropdowns?category=purpose').catch(() => ({ data: { data: [] } })),
        API.get('/master-dropdowns?category=reason').catch(() => ({ data: { data: [] } }))
      ]);

      setData({
        identity: idRes.data.data || [],
        relation: relRes.data.data || [],
        purpose: purRes.data.data || [],
        reason: reaRes.data.data || []
      });
    } catch (err) {
      console.error('Error fetching master lists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMasters();
  }, []);

  const handleOpenModal = (categoryKey) => {
    setActiveCategory(categoryKey);
    setNewItemName('');
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      setSubmitting(true);
      await API.post('/master-dropdowns', { 
        category: activeCategory, 
        name: newItemName.trim(), 
        status: 'Active' 
      });
      setIsModalOpen(false);
      setNewItemName('');
      fetchAllMasters();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTableCard = (title, categoryKey, columnName) => {
    const filteredData = data[categoryKey].filter(item => 
      item.name.toLowerCase().includes((searchQuery[categoryKey] || '').toLowerCase())
    );

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          <button 
            onClick={() => handleOpenModal(categoryKey)} 
            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-sm flex items-center gap-1 text-xs font-semibold"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="p-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search Table..." 
              value={searchQuery[categoryKey]}
              onChange={(e) => setSearchQuery({ ...searchQuery, [categoryKey]: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto min-h-[200px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-4">{columnName}</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-medium">{item.name}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-semibold rounded-md text-[10px]">
                        {item.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-8 text-slate-400 text-xs">
                    {loading ? 'Loading...' : 'No records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Rows per page: 5</span>
          <span>1-{filteredData.length} of {filteredData.length}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-100/60 min-h-screen relative">
      <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Mixed List Master Dashboard</h1>
          <p className="text-xs text-slate-500">Manage identity proofs, relations, purposes, and reason details.</p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-lg border border-indigo-100">
          ADMIN PANEL
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTableCard('Identity Proof Details List', 'identity', 'Identity')}
        {renderTableCard('Relation Details', 'relation', 'Relation')}
        {renderTableCard('Purpose Details', 'purpose', 'Purpose')}
        {renderTableCard('Reason Details', 'reason', 'Reason')}
      </div>

      {/* Modal Dialog Box */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm capitalize">
                Add New {activeCategory}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1.5">
                  {activeCategory} Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={`Enter ${activeCategory} name...`}
                  autoFocus
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterMixedView;