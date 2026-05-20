import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyStockOut from './DailyStockOut';
import DailyStockStatus from './DailyStockStatus';

export default function Reports() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('daily-stockout');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Reports</h1>
        <button onClick={() => navigate('/menu')} className="bg-gray-500 text-white px-4 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm">Menu</button>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('daily-stockout')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${tab === 'daily-stockout' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
          >
            Daily Stock Out
          </button>
          <button
            onClick={() => setTab('daily-stock-status')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${tab === 'daily-stock-status' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
          >
            Daily Stock Status
          </button>
        </div>

        {tab === 'daily-stockout' && <DailyStockOut />}
        {tab === 'daily-stock-status' && <DailyStockStatus />}
      </div>
    </div>
  );
}
