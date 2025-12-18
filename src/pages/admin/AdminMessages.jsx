import { useState, useEffect } from 'react';
import { Trash2, MailOpen, Mail, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiCall, API_ENDPOINTS } from '../../config/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [page, search, filterStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(search && { search }),
        ...(filterStatus && { status: filterStatus })
      });

      const response = await apiCall(
        `${API_ENDPOINTS.CONTACT.LIST}?${params}`
      );

      setMessages(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, currentStatus) => {
    try {
      if (currentStatus === 'unread') {
        await apiCall(API_ENDPOINTS.CONTACT.MARK_READ(id), {
          method: 'PUT'
        });
        setSuccess('Message marqué comme lu');
      }
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr?')) return;
    try {
      await apiCall(API_ENDPOINTS.CONTACT.DELETE(id), {
        method: 'DELETE'
      });
      setSuccess('Message supprimé');
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">{error}</div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-4">{success}</div>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tous les statuts</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
            </select>
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-lg shadow divide-y max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Chargement...</div>
            ) : messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Aucun message</div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    handleMarkAsRead(msg.id, msg.status);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                    msg.status === 'unread'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{msg.name}</p>
                      <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {msg.status === 'unread' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    De: <strong>{selectedMessage.name}</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{selectedMessage.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      selectedMessage.status === 'unread'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedMessage.status === 'unread' ? 'Non lu' : 'Lu'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Message</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id, 'unread')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <MailOpen className="w-4 h-4" />
                    Marquer comme lu
                  </button>
                )}
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4" />
                  Répondre
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sélectionnez un message pour le consulter</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
