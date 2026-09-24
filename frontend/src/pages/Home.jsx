import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, deleteItem } from '../redux/slices/itemSlice';
import ItemCard from '../components/ItemCard';

const Home = () => {
  const dispatch = useDispatch();
  const { data: items, loading, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  if (loading) {
    return <div className="text-center mt-10 text-slate-500">Loading data...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Items List (Redux State)</h1>
      {items.length === 0 ? (
        <p className="text-slate-500">No items found. Add some from the navbar.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;