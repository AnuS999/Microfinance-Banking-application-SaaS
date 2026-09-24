import React from 'react';
import { Trash2 } from 'lucide-react';

const ItemCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
        <p className="text-slate-600 text-sm mt-1">{item.description}</p>
      </div>
      <button
        onClick={() => onDelete(item._id)}
        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
        title="Delete Item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default ItemCard;