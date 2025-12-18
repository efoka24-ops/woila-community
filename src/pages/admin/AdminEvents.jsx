import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Users, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiCall, API_ENDPOINTS } from '../../config/api';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAttendees, setShowAttendees] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchEvents();
  }, [page, search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        published: 'all',
        ...(search && { search })
      });

      const response = await apiCall(
        `${API_ENDPOINTS.EVENTS.LIST}?${params}`
      );

      setEvents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      setSuccess('');

      const payload = {
        ...data,
        capacity: parseInt(data.capacity)
      };

      if (editingId) {
        await apiCall(API_ENDPOINTS.EVENTS.UPDATE(editingId), {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setSuccess('Événement mis à jour');
      } else {
        await apiCall(API_ENDPOINTS.EVENTS.CREATE, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setSuccess('Événement créé');
      }

      fetchEvents();
      setShowForm(false);
      setEditingId(null);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr?')) return;
    try {
      await apiCall(API_ENDPOINTS.EVENTS.DELETE(id), {
        method: 'DELETE'
      });
      setSuccess('Événement supprimé');
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Événements</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              reset();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvel événement
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Modifier l\'événement' : 'Créer un événement'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  {...register('title', { required: 'Requis' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  {...register('description', { required: 'Requis' })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    {...register('date', { required: 'Requis' })}
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lieu</label>
                  <input
                    {...register('location', { required: 'Requis' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Capacité</label>
                  <input
                    {...register('capacity', { required: 'Requis' })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Formation">Formation</option>
                    <option value="Networking">Networking</option>
                    <option value="Conférence">Conférence</option>
                    <option value="Atelier">Atelier</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Lieu</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Inscrits</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">Chargement...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Aucun événement</td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.location}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setShowAttendees(showAttendees === event.id ? null : event.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <Users className="w-4 h-4" />
                        {(event.attendees || []).length}/{event.capacity}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => {
                          reset(event);
                          setEditingId(event.id);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Attendees Modal */}
        {showAttendees && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Inscrits à l'événement: {events.find(e => e.id === showAttendees)?.title}
            </h3>
            <div className="space-y-2">
              {(events.find(e => e.id === showAttendees)?.attendees || []).map((attendee, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded">
                  <p className="font-medium">{attendee.name}</p>
                  <p className="text-sm text-gray-600">{attendee.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
