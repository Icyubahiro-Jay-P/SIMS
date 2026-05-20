import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function StockOutForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ stockOutQuantity: '', stockOutUnitPrice: '', stockOutDate: new Date().toISOString().split('T')[0], sparePart: '' });
  const [parts, setParts] = useState([]);
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParts();
    fetchRecords();
  }, []);

  const fetchParts = async () => {
    try { const { data } = await api.get('/spare-parts'); setParts(data); }
    catch { setError('Failed to load parts'); }
  };

  const fetchRecords = async () => {
    try { const { data } = await api.get('/stock-out'); setRecords(data); }
    catch { setError('Failed to load records'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      if (editing) {
        await api.put(`/stock-out/${editing}`, form);
        setMessage('Stock out updated successfully');
        setEditing(null);
      } else {
        await api.post('/stock-out', form);
        setMessage('Stock out recorded successfully');
      }
      setForm({ stockOutQuantity: '', stockOutUnitPrice: '', stockOutDate: new Date().toISOString().split('T')[0], sparePart: '' });
      fetchParts();
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setEditing(record._id);
    setForm({
      stockOutQuantity: record.stockOutQuantity,
      stockOutUnitPrice: record.stockOutUnitPrice,
      stockOutDate: new Date(record.stockOutDate).toISOString().split('T')[0],
      sparePart: record.sparePart?._id || '',
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock out record?')) return;
    try {
      await api.delete(`/stock-out/${id}`);
      setMessage('Stock out record deleted');
      fetchParts();
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm({ stockOutQuantity: '', stockOutUnitPrice: '', stockOutDate: new Date().toISOString().split('T')[0], sparePart: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Stock Out</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/menu')} className="bg-gray-500 text-white px-4 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm">Menu</button>
          <button onClick={() => navigate('/stock-in')} className="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition text-sm">Stock In</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Edit Stock Out' : 'Add Stock Out'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select name="sparePart" value={form.sparePart} onChange={(e) => {
              const part = parts.find(p => p._id === e.target.value);
              setForm({ ...form, sparePart: e.target.value, stockOutUnitPrice: part ? part.unitPrice : '' });
            }} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none" required>
              <option value="">Select Spare Part</option>
              {parts.map((p) => <option key={p._id} value={p._id}>{p.name} (Avail: {p.quantity})</option>)}
            </select>
            <input type="number" value={form.stockOutQuantity} onChange={(e) => setForm({ ...form, stockOutQuantity: e.target.value })} placeholder="Quantity" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none" required />
            <input type="number" step="0.01" value={form.stockOutUnitPrice} onChange={(e) => setForm({ ...form, stockOutUnitPrice: e.target.value })} placeholder="Unit Price" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none" required />
            <input type="date" value={form.stockOutDate} onChange={(e) => setForm({ ...form, stockOutDate: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none" required />
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-semibold">
                {editing ? 'Update Stock Out' : 'Record Stock Out'}
              </button>
              {editing && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Out Records</h2>
          {records.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No stock out records</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 px-3">Spare Part</th>
                    <th className="py-2 px-3 text-right">Qty Out</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{r.sparePart?.name || 'N/A'}</td>
                      <td className="py-2 px-3 text-right">{r.stockOutQuantity}</td>
                      <td className="py-2 px-3 text-right">${r.stockOutUnitPrice?.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">${r.stockOutTotalPrice?.toFixed(2)}</td>
                      <td className="py-2 px-3">{new Date(r.stockOutDate).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(r)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-medium">Edit</button>
                          <button onClick={() => handleDelete(r._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs font-medium">Delete</button>
                        </div>
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
}
