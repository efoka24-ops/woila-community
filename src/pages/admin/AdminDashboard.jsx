import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, articles: 0, events: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [membersRes, blogRes, eventsRes, contactRes] = await Promise.all([
          fetch('http://localhost:5000/api/members', { headers }),
          fetch('http://localhost:5000/api/blog', { headers }),
          fetch('http://localhost:5000/api/events', { headers }),
          fetch('http://localhost:5000/api/contact', { headers })
        ]);

        const members = await membersRes.json();
        const blog = await blogRes.json();
        const events = await eventsRes.json();
        const contact = await contactRes.json();

        setStats({
          members: Array.isArray(members) ? members.length : 0,
          articles: Array.isArray(blog) ? blog.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          messages: Array.isArray(contact) ? contact.length : 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`${color} text-white rounded-lg p-6 shadow-lg`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon="👥" label="Members" value={stats.members} color="bg-blue-500" />
              <StatCard icon="📝" label="Articles" value={stats.articles} color="bg-green-500" />
              <StatCard icon="📅" label="Events" value={stats.events} color="bg-purple-500" />
              <StatCard icon="💬" label="Messages" value={stats.messages} color="bg-orange-500" />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <a href="/admin/members" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
                  Manage Members
                </a>
                <a href="/admin/blog" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center">
                  Manage Articles
                </a>
                <a href="/admin/events" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center">
                  Manage Events
                </a>
                <a href="/admin/messages" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-center">
                  Messages
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
