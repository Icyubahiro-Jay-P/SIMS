import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function DailyStockStatus() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async (d) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reports/daily-stock-status?date=${d || date}`);
      setReport(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReport(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Daily Stock Status Report</h2>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-semibold">Search</button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading...</p>
      ) : report.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-3">Spare Part Name</th>
                <th className="py-2 px-3 text-right">Stored Qty</th>
                <th className="py-2 px-3 text-right">Stock Out</th>
                <th className="py-2 px-3 text-right">Remaining Qty</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{r.name}</td>
                  <td className="py-2 px-3 text-right">{r.storedQty}</td>
                  <td className="py-2 px-3 text-right">{r.stockOut}</td>
                  <td className="py-2 px-3 text-right font-semibold">{r.remainingQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
