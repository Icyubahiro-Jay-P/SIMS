import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Spare Parts', path: '/spare-part', icon: '📦', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Stock In', path: '/stock-in', icon: '📥', color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Stock Out', path: '/stock-out', icon: '📤', color: 'bg-orange-500 hover:bg-orange-600' },
  { label: 'Reports', path: '/reports', icon: '📊', color: 'bg-purple-500 hover:bg-purple-600' },
];

export default function Menu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">SIMS</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Main Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`${item.color} text-white p-8 rounded-2xl shadow-lg transition transform hover:scale-105 text-center`}
            >
              <span className="text-5xl block mb-3">{item.icon}</span>
              <span className="text-xl font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
