import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function DailyStockOut() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async (d) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/daily-stockout?date=${d || date}`);
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReport(date);
  };

  const total = records.reduce((sum, r) => sum + r.stockOutTotalPrice, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Stock Out Report</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold">Search</button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No stock out records for this date</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-3">Spare Part</th>
                <th className="py-2 px-3 text-right">Qty Out</th>
                <th className="py-2 px-3 text-right">Unit Price</th>
                <th className="py-2 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium">{r.sparePart?.name || 'N/A'}</td>
                  <td className="py-2 px-3 text-right">{r.stockOutQuantity}</td>
                  <td className="py-2 px-3 text-right">${r.stockOutUnitPrice?.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">${r.stockOutTotalPrice?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-2 px-3">Total</td>
                <td className="py-2 px-3 text-right">{records.reduce((s, r) => s + r.stockOutQuantity, 0)}</td>
                <td className="py-2 px-3"></td>
                <td className="py-2 px-3 text-right">${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
