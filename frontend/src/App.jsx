import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Menu from './components/Menu';
import SparePartForm from './components/SparePartForm';
import StockInForm from './components/StockInForm';
import StockOutForm from './components/StockOutForm';
import Reports from './components/Reports';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/spare-part" element={<ProtectedRoute><SparePartForm /></ProtectedRoute>} />
        <Route path="/stock-in" element={<ProtectedRoute><StockInForm /></ProtectedRoute>} />
        <Route path="/stock-out" element={<ProtectedRoute><StockOutForm /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}
