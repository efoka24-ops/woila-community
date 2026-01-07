import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    category: 'Training'
  });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [search]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/events';
      if (search) url += `?search=${search}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur fetchEvents:', err);
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (!form.title || !form.date || !form.description || !form.location || !form.capacity) {
        setError('Tous les champs sont requis');
        return;
      }

      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/events/${editingId}`
        : 'http://localhost:5000/api/events';
      
      console.log('Envoi:', { url, method, form });
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          capacity: parseInt(form.capacity)
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }
      
      setSuccess(editingId ? 'Événement mis à jour!' : 'Événement créé!');
      setForm({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        category: 'Training'
      });
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => {
        setSuccess('');
        fetchEvents();
      }, 1500);
    } catch (err) {
      console.error('Erreur création:', err);
      setError(err.message || 'Erreur lors de la création');
    }
  };

  const handleEdit = (event) => {
    setForm(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    setRegistrations(event.registrations || []);
  };

  const handleDeleteRegistration = async (eventId, email) => {
    if (!window.confirm('Supprimer cette inscription?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/registrations/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setRegistrations(registrations.filter(r => r.email !== email));
        setSuccess('Inscription supprimée!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression');
    }
  };

  const handleUpdateRegistration = async () => {
    if (!editingRegistration) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/events/${selectedEvent.id}/registrations/${editingRegistration.email}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: editingRegistration.status,
            notes: editingRegistration.notes
          })
        }
      );

      if (response.ok) {
        const updatedRegs = registrations.map(r =>
          r.email === editingRegistration.email ? editingRegistration : r
        );
        setRegistrations(updatedRegs);
        setEditingRegistration(null);
        setSuccess('Inscription mise à jour!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleSendConfirmation = async (registration) => {
    if (!confirmationMessage.trim()) {
      setError('Veuillez écrire un message');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/events/${selectedEvent.id}/registrations/${registration.email}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: confirmationMessage,
            subject: `Confirmation - ${selectedEvent.title}`
          })
        }
      );

      if (response.ok) {
        setSuccess('Confirmation envoyée!');
        setConfirmationMessage('');
        const updatedRegs = registrations.map(r =>
          r.email === registration.email ? { ...r, status: 'confirmed' } : r
        );
        setRegistrations(updatedRegs);
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'envoi');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Events Management</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                title: '',
                description: '',
                date: '',
                location: '',
                capacity: '',
                category: 'Training'
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : '+ New Event'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border rounded h-24"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="px-4 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="px-4 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="px-4 py-2 border rounded"
                  required
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="px-4 py-2 border rounded"
                >
                  <option>Training</option>
                  <option>Networking</option>
                  <option>Conference</option>
                  <option>Workshop</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                {editingId ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3">Attendees</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{event.title}</td>
                    <td className="px-4 py-3">{event.date ? new Date(event.date).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">{event.location}</td>
                    <td className="px-4 py-3 text-center">
                      {event.registrations?.length || 0} / {event.capacity}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleViewRegistrations(event)}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600"
                      >
                        Registrations ({event.registrations?.length || 0})
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registrations Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-purple-600 text-white p-6 sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                  <p className="text-purple-100 mt-1">
                    {registrations.length} / {selectedEvent.capacity} inscriptions
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white text-2xl hover:text-purple-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {registrations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucune inscription pour cet événement</p>
              ) : (
                <div className="space-y-3">
                  {registrations.map((reg) => (
                    <div
                      key={reg.email}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {reg.firstName} {reg.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{reg.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Inscrit le {new Date(reg.registeredAt).toLocaleDateString('fr-FR')}
                          </p>
                          {reg.status && (
                            <p className="text-xs mt-2">
                              Statut:{' '}
                              <span className={`font-semibold ${
                                reg.status === 'confirmed' ? 'text-green-600' :
                                reg.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {reg.status === 'confirmed' ? '✓ Confirmé' :
                                 reg.status === 'pending' ? '⏳ En attente' :
                                 '✗ Rejeté'}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingRegistration(reg)}
                            className="bg-blue-500 text-white px-3 py-2 rounded text-xs hover:bg-blue-600"
                          >
                            Éditer
                          </button>
                          <button
                            onClick={() => {
                              setEditingRegistration(reg);
                              setConfirmationMessage(`
Bonjour ${reg.firstName},

Nous avons bien reçu votre inscription pour l'événement "${selectedEvent.title}".

Date : ${new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
Lieu : ${selectedEvent.location}

Nous vous remercions de votre intérêt. À bientôt!

Cordialement,
L'équipe Woila Community`);
                            }}
                            className="bg-green-500 text-white px-3 py-2 rounded text-xs hover:bg-green-600"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(selectedEvent.id, reg.email)}
                            className="bg-red-500 text-white px-3 py-2 rounded text-xs hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Info */}
              <div className="mt-8 pt-6 border-t space-y-3">
                <h3 className="font-bold text-gray-900">Détails de l'événement</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lieu</p>
                    <p className="font-semibold">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Catégorie</p>
                    <p className="font-semibold">{selectedEvent.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Capacité</p>
                    <p className="font-semibold">{selectedEvent.capacity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t sticky bottom-0">
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editingRegistration && !confirmationMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-xl font-bold">Éditer l'inscription</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-semibold">{editingRegistration.firstName} {editingRegistration.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{editingRegistration.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={editingRegistration.status || 'pending'}
                  onChange={(e) => setEditingRegistration({
                    ...editingRegistration,
                    status: e.target.value
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">⏳ En attente</option>
                  <option value="confirmed">✓ Confirmé</option>
                  <option value="rejected">✗ Rejeté</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editingRegistration.notes || ''}
                  onChange={(e) => setEditingRegistration({
                    ...editingRegistration,
                    notes: e.target.value
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Notes internes..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingRegistration(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateRegistration}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Message Modal */}
      {editingRegistration && confirmationMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-green-600 text-white p-6 sticky top-0">
              <h2 className="text-xl font-bold">Envoyer une confirmation</h2>
              <p className="text-green-100 text-sm mt-1">
                À: {editingRegistration.firstName} {editingRegistration.lastName} ({editingRegistration.email})
              </p>
            </div>
            <div className="p-6 space-y-4">
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message à envoyer</label>
                <textarea
                  value={confirmationMessage}
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 h-48 font-mono text-sm"
                  placeholder="Message de confirmation..."
                />
              </div>
              <p className="text-xs text-gray-500">
                💡 Ce message sera envoyé par email au participant
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingRegistration(null);
                    setConfirmationMessage('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSendConfirmation(editingRegistration)}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  📧 Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
