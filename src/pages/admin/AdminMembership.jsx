import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, Check, X, Search, Filter } from 'lucide-react';

export default function AdminMembership() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Charger les demandes
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`http://localhost:5000/api/membership-requests?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erreur au chargement');
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [statusFilter, searchQuery]);

  // Approuver une demande
  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/membership-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirmationMessage })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'approbation');

      setSuccessMessage('✓ Demande approuvée et confirmation envoyée par email');
      setShowApprovalModal(false);
      setConfirmationMessage('');
      setSelectedRequest(null);

      // Recharger
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Rejeter une demande
  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/membership-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          rejectionReason,
          rejectionMessage
        })
      });

      if (!response.ok) throw new Error('Erreur lors du rejet');

      setSuccessMessage('✓ Demande rejetée et notification envoyée par email');
      setShowRejectionModal(false);
      setRejectionReason('');
      setRejectionMessage('');
      setSelectedRequest(null);

      // Recharger
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Supprimer une demande
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/membership-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setSuccessMessage('✓ Demande supprimée');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Ouvrir modal d'approbation
  const openApprovalModal = (request) => {
    setSelectedRequest(request);
    setConfirmationMessage(`Bonjour ${request.firstName} ${request.lastName},

Nous sommes heureux de vous accueillir dans la communauté Woila Community!

Votre demande d'inscription a été approuvée avec succès. Vous pouvez maintenant accéder à tous les avantages et opportunités disponibles pour nos membres.

Bienvenue dans la famille Woila Community!

Cordialement,
L'équipe Woila Community`);
    setShowApprovalModal(true);
  };

  // Ouvrir modal de rejet
  const openRejectionModal = (request) => {
    setSelectedRequest(request);
    setRejectionMessage(`Bonjour ${request.firstName} ${request.lastName},

Nous avons examiné votre demande d'inscription à Woila Community.

Malheureusement, votre demande a été rejetée pour la raison suivante:
${rejectionReason || 'Non spécifié'}

Si vous pensez qu'il y a une erreur ou si vous souhaitez réessayer, veuillez nous contacter.

Cordialement,
L'équipe Woila Community`);
    setShowRejectionModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ En attente';
      case 'approved':
        return '✓ Approuvée';
      case 'rejected':
        return '✗ Rejetée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Demandes d'Inscription</h2>
          <p className="text-gray-600 mt-1">Total: {requests.length} demande(s)</p>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {errorMessage}
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-4 flex-wrap">
        <div className="flex-1 min-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvées</option>
          <option value="rejected">Rejetées</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Téléphone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ville</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map(request => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{request.firstName} {request.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.phone}</td>
                  <td className="px-6 py-4 text-sm">{request.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openApprovalModal(request)}
                          className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openRejectionModal(request)}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune demande d'inscription</p>
          </div>
        )}
      </div>

      {/* Modal d'approbation */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Approuver la demande</h3>
              <p className="text-gray-600 mt-1">{selectedRequest?.firstName} {selectedRequest?.lastName}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message de confirmation</label>
                <textarea
                  value={confirmationMessage}
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rejeter la demande</h3>
              <p className="text-gray-600 mt-1">{selectedRequest?.firstName} {selectedRequest?.lastName}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison du rejet</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une raison...</option>
                  <option value="Documents incomplets">Documents incomplets</option>
                  <option value="Informations invalides">Informations invalides</option>
                  <option value="Paiement non confirmé">Paiement non confirmé</option>
                  <option value="Non conformité aux critères">Non conformité aux critères</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message de rejet</label>
                <textarea
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  rows="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
