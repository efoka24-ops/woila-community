import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Filter on frontend based on read status
      let filtered = Array.isArray(data) ? data : [];
      if (filter === 'unread') {
        filtered = filtered.filter(m => !m.read);
      } else if (filter === 'read') {
        filtered = filtered.filter(m => m.read);
      }
      
      setMessages(filtered);
      if (filtered.length > 0) setSelectedMsg(filtered[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/contact/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete message?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSelectedMsg(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages Management</h1>

        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <div className="flex gap-2 mb-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border rounded"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No messages</div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMsg(msg)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedMsg?.id === msg.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } ${!msg.read ? 'bg-yellow-50' : ''}`}
                    >
                      <p className="font-bold text-sm">{msg.name}</p>
                      <p className="text-xs text-gray-600 truncate">{msg.subject || 'No subject'}</p>
                      {!msg.read && <div className="mt-1 text-xs text-blue-600">● Unread</div>}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Message Detail */}
            {selectedMsg && (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMsg.name}</h2>
                      <p className="text-gray-600">{selectedMsg.email}</p>
                      {selectedMsg.phone && <p className="text-gray-600">{selectedMsg.phone}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkRead(selectedMsg.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                      >
                        {selectedMsg.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedMsg.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-500">
                      {selectedMsg.createdAt ? new Date(selectedMsg.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  {selectedMsg.subject && (
                    <div className="mb-4">
                      <p className="text-sm font-bold text-gray-600">Subject:</p>
                      <p className="text-lg">{selectedMsg.subject}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded mb-4 max-h-64 overflow-y-auto">
                    <p className="text-sm font-bold text-gray-600 mb-2">Message:</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedMsg.message}</p>
                  </div>

                  <a
                    href={`mailto:${selectedMsg.email}`}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Reply by Email
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
