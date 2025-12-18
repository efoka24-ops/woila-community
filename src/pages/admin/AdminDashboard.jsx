import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Calendar, Mail, TrendingUp, Eye, Download } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiCall, API_ENDPOINTS } from '../../config/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: { total: 0, thisMonth: 0, thisWeek: 0 },
    blog: { total: 0, published: 0, draft: 0, topViews: 0 },
    events: { total: 0, upcoming: 0 },
    contact: { total: 0, unread: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [memberStats, blogStats, eventStats, contactStats] = await Promise.all([
        apiCall(API_ENDPOINTS.MEMBERS.STATS),
        apiCall(API_ENDPOINTS.BLOG.STATS),
        apiCall(API_ENDPOINTS.EVENTS.LIST),
        apiCall(API_ENDPOINTS.CONTACT.LIST)
      ]);

      setStats({
        members: memberStats.data,
        blog: blogStats.data,
        events: eventStats.data || { total: 0, upcoming: 0 },
        contact: contactStats.data || { total: 0, unread: 0 }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <Icon className="w-12 h-12 text-blue-500 opacity-20" />
      </div>
    </div>
  );

  // Données pour chart membres
  const memberData = [
    { name: 'Semaine', value: stats.members.thisWeek || 0 },
    { name: 'Mois', value: stats.members.thisMonth || 0 },
    { name: 'Total', value: stats.members.total || 0 }
  ];

  // Données pour chart blog
  const blogData = [
    { name: 'Brouillons', value: stats.blog.draft || 0, fill: '#fbbf24' },
    { name: 'Publiés', value: stats.blog.published || 0, fill: '#10b981' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Bienvenue dans votre espace administrateur</p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            label="Membres"
            value={stats.members.total}
            trend={`+${stats.members.thisMonth} ce mois`}
            color="blue"
          />
          <StatCard
            icon={FileText}
            label="Articles"
            value={stats.blog.total}
            trend={`${stats.blog.published} publiés`}
            color="green"
          />
          <StatCard
            icon={Calendar}
            label="Événements"
            value={stats.events.total}
            trend={`${stats.events.upcoming} à venir`}
            color="purple"
          />
          <StatCard
            icon={Mail}
            label="Messages"
            value={stats.contact.total}
            trend={`${stats.contact.unread} non lus`}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Croissance des membres</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Blog Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">État du blog</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={blogData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {blogData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/admin/members"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center"
            >
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Gérer les membres</p>
            </a>
            <a
              href="/admin/blog"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-center"
            >
              <FileText className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Gérer les articles</p>
            </a>
            <a
              href="/admin/events"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-center"
            >
              <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Gérer les événements</p>
            </a>
            <a
              href="/admin/messages"
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition text-center"
            >
              <Mail className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Voir les messages</p>
            </a>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Download className="w-4 h-4" />
            Exporter les données
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
