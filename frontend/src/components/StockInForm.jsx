import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function StockInForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ stockInQuantity: '', stockInDate: new Date().toISOString().split('T')[0], sparePart: '' });
  const [parts, setParts] = useState([]);
  const [records, setRecords] = useState([]);
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
    try { const { data } = await api.get('/stock-in'); setRecords(data); }
    catch { setError('Failed to load records'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/stock-in', form);
      setMessage('Stock in recorded successfully');
      setForm({ stockInQuantity: '', stockInDate: new Date().toISOString().split('T')[0], sparePart: '' });
      fetchParts();
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record stock in');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Stock In</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/menu')} className="bg-gray-500 text-white px-4 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm">Menu</button>
          <button onClick={() => navigate('/stock-out')} className="bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition text-sm">Stock Out</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Stock In</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select name="sparePart" value={form.sparePart} onChange={(e) => setForm({ ...form, sparePart: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" required>
              <option value="">Select Spare Part</option>
              {parts.map((p) => <option key={p._id} value={p._id}>{p.name} (Qty: {p.quantity})</option>)}
            </select>
            <input name="stockInQuantity" type="number" value={form.stockInQuantity} onChange={(e) => setForm({ ...form, stockInQuantity: e.target.value })} placeholder="Quantity" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" required />
            <input name="stockInDate" type="date" value={form.stockInDate} onChange={(e) => setForm({ ...form, stockInDate: e.target.value })} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" required />
            <div className="sm:col-span-3">
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">Record Stock In</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock In History</h2>
          {records.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No stock in records</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 px-3">Spare Part</th>
                    <th className="py-2 px-3 text-right">Quantity</th>
                    <th className="py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{r.sparePart?.name || 'N/A'}</td>
                      <td className="py-2 px-3 text-right">{r.stockInQuantity}</td>
                      <td className="py-2 px-3">{new Date(r.stockInDate).toLocaleDateString()}</td>
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
