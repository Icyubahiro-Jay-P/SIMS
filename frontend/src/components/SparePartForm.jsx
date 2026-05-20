import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SparePartForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unitPrice: '' });
  const [parts, setParts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchParts(); }, []);

  const fetchParts = async () => {
    try {
      const { data } = await api.get('/spare-parts');
      setParts(data);
    } catch { setError('Failed to load parts'); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/spare-parts', form);
      setMessage('Spare part added successfully');
      setForm({ name: '', category: '', quantity: '', unitPrice: '' });
      fetchParts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add spare part');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Spare Parts</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/menu')} className="bg-gray-500 text-white px-4 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm">Menu</button>
          <button onClick={() => navigate('/stock-in')} className="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition text-sm">Stock In</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Spare Part</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Part Name" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
            <input name="unitPrice" type="number" step="0.01" value={form.unitPrice} onChange={handleChange} placeholder="Unit Price" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
            <div className="sm:col-span-2">
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">Add Spare Part</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Spare Parts List</h2>
          {parts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No spare parts added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => (
                    <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{p.name}</td>
                      <td className="py-2 px-3">{p.category}</td>
                      <td className="py-2 px-3 text-right">{p.quantity}</td>
                      <td className="py-2 px-3 text-right">${p.unitPrice?.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">${p.totalPrice?.toFixed(2)}</td>
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
}
