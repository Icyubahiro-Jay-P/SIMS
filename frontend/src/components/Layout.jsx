import { Outlet } from 'react-router-dom';
import Menu from './Menu';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Menu />
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
