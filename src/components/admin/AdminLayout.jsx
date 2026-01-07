import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: '📊 Dashboard', path: '/admin/dashboard' },
    { label: '👥 Members Management', path: '/admin/members' },
    { label: '�📝 Blog', path: '/admin/blog' },
    { label: '📅 Events', path: '/admin/events' },
    { label: '💬 Messages', path: '/admin/messages' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          {sidebarOpen && <h1 className="text-xl font-bold">WOILA Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 font-bold'
                  : 'hover:bg-gray-800'
              }`}
              title={sidebarOpen ? '' : item.label}
            >
              {sidebarOpen ? item.label : item.label.charAt(0)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          {sidebarOpen && (
            <div className="text-xs text-gray-400 mb-3">
              <p className="font-bold">Admin Panel</p>
              <p className="text-gray-500">admin@woila.com</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
            <a href="/" className="text-blue-600 hover:underline">← Back to Site</a>
          </div>
        </header>

        <main className="bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
