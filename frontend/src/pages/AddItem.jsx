import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../redux/slices/itemSlice';

const AddItem = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    dispatch(addItem(formData)).then((result) => {
      if (!result.error) {
        navigate('/');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Create New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="Enter description"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;