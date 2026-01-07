import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminMembers() {
  // Existing Members Tab
  const [members, setMembers] = useState([]);
  const [membersSearch, setMembersSearch] = useState('');
  const [membersPage, setMembersPage] = useState(1);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', city: '' });

  // Membership Requests Tab
  const [requests, setRequests] = useState([]);
  const [requestsSearch, setRequestsSearch] = useState('');
  const [requestsFilter, setRequestsFilter] = useState('pending');
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [detailsModal, setDetailsModal] = useState(null);
  const [approvalModal, setApprovalModal] = useState(null);
  const [rejectionModal, setRejectionModal] = useState(null);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('members');

  const limit = 10;

  // ========== MEMBERS SECTION ==========
  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers();
    }
  }, [membersPage, membersSearch, activeTab]);

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/members?page=${membersPage}&limit=${limit}${membersSearch ? `&search=${membersSearch}` : ''}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/members/${editingId}`
        : 'http://localhost:5000/api/members';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', city: '' });
        setEditingId(null);
        setShowForm(false);
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Delete member?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/members/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  // ========== MEMBERSHIP REQUESTS SECTION ==========
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [requestsFilter, requestsSearch, activeTab]);

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/membership-requests';
      const params = new URLSearchParams();
      if (requestsFilter !== 'all') params.append('status', requestsFilter);
      if (requestsSearch) params.append('search', requestsSearch);
      if (params.toString()) url += '?' + params.toString();

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/membership-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ confirmationMessage: approvalMessage })
      });

      if (response.ok) {
        setRequestMessage('Demande approuvée avec succès!');
        setApprovalModal(null);
        setApprovalMessage('');
        fetchRequests();
        setTimeout(() => setRequestMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setRequestMessage('Erreur lors de l\'approbation');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/membership-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rejectionReason: rejectionReason,
          rejectionMessage: rejectionMessage 
        })
      });

      if (response.ok) {
        setRequestMessage('Demande rejetée');
        setRejectionModal(null);
        setRejectionReason('');
        setRejectionMessage('');
        fetchRequests();
        setTimeout(() => setRequestMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setRequestMessage('Erreur lors du rejet');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Supprimer cette demande?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/membership-requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">👥 Members Management</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'members'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Members
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            ✍️ Membership Requests
          </button>
        </div>

        {requestMessage && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {requestMessage}
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', city: '' });
                  setShowForm(!showForm);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {showForm ? 'Cancel' : '+ Add Member'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="px-4 py-2 border rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="px-4 py-2 border rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-4 py-2 border rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="px-4 py-2 border rounded"
                  />
                  <button type="submit" className="col-span-2 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                    {editingId ? 'Update Member' : 'Create Member'}
                  </button>
                </form>
              </div>
            )}

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search members..."
                value={membersSearch}
                onChange={(e) => { setMembersSearch(e.target.value); setMembersPage(1); }}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            {membersLoading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Company</th>
                        <th className="px-4 py-3 text-left">City</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(member => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{member.firstName} {member.lastName}</td>
                          <td className="px-4 py-3">{member.email}</td>
                          <td className="px-4 py-3">{member.company || '-'}</td>
                          <td className="px-4 py-3">{member.city || '-'}</td>
                          <td className="px-4 py-3 text-center space-x-2">
                            <button
                              onClick={() => handleEdit(member)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
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

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setMembersPage(p => Math.max(1, p - 1))}
                    disabled={membersPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {membersPage}</span>
                  <button
                    onClick={() => setMembersPage(p => p + 1)}
                    disabled={members.length < limit}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* MEMBERSHIP REQUESTS TAB */}
        {activeTab === 'requests' && (
          <>
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Search by name, email, or city..."
                value={requestsSearch}
                onChange={(e) => setRequestsSearch(e.target.value)}
                className="flex-1 px-4 py-2 border rounded"
              />
              <select
                value={requestsFilter}
                onChange={(e) => setRequestsFilter(e.target.value)}
                className="px-4 py-2 border rounded"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {requestsLoading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">City</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{request.firstName} {request.lastName}</td>
                        <td className="px-4 py-3">{request.email}</td>
                        <td className="px-4 py-3">{request.phone}</td>
                        <td className="px-4 py-3">{request.city}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center space-x-2">
                          <button
                            onClick={() => setDetailsModal(request)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                          >
                            View Details
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setApprovalModal(request);
                                  setApprovalMessage(`Bonjour ${request.firstName},\n\nBienvenue chez Woila Community!`);
                                }}
                                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectionModal(request);
                                  setRejectionReason('');
                                  setRejectionMessage(`Bonjour ${request.firstName},\n\nMalheureusement, votre demande a été rejetée.`);
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
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
          </>
        )}

        {/* Details Modal */}
        {detailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {detailsModal.firstName} {detailsModal.lastName}
                </h3>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">First Name</label>
                  <p className="text-gray-800 font-medium">{detailsModal.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Last Name</label>
                  <p className="text-gray-800 font-medium">{detailsModal.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-800 font-medium">{detailsModal.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phone</label>
                  <p className="text-gray-800 font-medium">{detailsModal.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Structure</label>
                  <p className="text-gray-800 font-medium">{detailsModal.structure || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Activity Sector</label>
                  <p className="text-gray-800 font-medium">{detailsModal.activitySector || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">City</label>
                  <p className="text-gray-800 font-medium">{detailsModal.city}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(detailsModal.status)}`}>
                    {detailsModal.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Submission Date</label>
                  <p className="text-gray-800 font-medium">{new Date(detailsModal.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Payment Proof */}
              {detailsModal.paymentProofUrl && (
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Payment Proof / Document</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    {detailsModal.paymentProofUrl.startsWith('data:') ? (
                      <>
                        {detailsModal.paymentProofUrl.startsWith('data:image/') ? (
                          <div className="flex flex-col items-center">
                            <img 
                              src={detailsModal.paymentProofUrl} 
                              alt="Payment Proof" 
                              className="max-w-full max-h-80 rounded border"
                              style={{ maxWidth: '100%', height: 'auto' }}
                            />
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = detailsModal.paymentProofUrl;
                                link.download = `payment-proof-${detailsModal.id}.png`;
                                link.click();
                              }}
                              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                              Download Image
                            </button>
                          </div>
                        ) : detailsModal.paymentProofUrl.startsWith('data:application/pdf') ? (
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">📄</div>
                            <p className="text-gray-700 font-semibold mb-3">PDF Document Uploaded</p>
                            <embed 
                              src={detailsModal.paymentProofUrl} 
                              type="application/pdf" 
                              width="100%" 
                              height="400"
                              className="rounded border"
                            />
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = detailsModal.paymentProofUrl;
                                link.download = `payment-proof-${detailsModal.id}.pdf`;
                                link.click();
                              }}
                              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                              Download PDF
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">📎</div>
                            <p className="text-gray-700 font-semibold">Document Uploaded</p>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = detailsModal.paymentProofUrl;
                                link.download = `document-${detailsModal.id}`;
                                link.click();
                              }}
                              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                              Download Document
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-gray-600">
                        <p className="text-sm">No document data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {detailsModal.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setDetailsModal(null);
                      setApprovalModal(detailsModal);
                      setApprovalMessage(`Bonjour ${detailsModal.firstName},\n\nBienvenue chez Woila Community!`);
                    }}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 font-semibold"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      setDetailsModal(null);
                      setRejectionModal(detailsModal);
                      setRejectionReason('');
                      setRejectionMessage(`Bonjour ${detailsModal.firstName},\n\nMalheureusement, votre demande a été rejetée.`);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
                  >
                    Reject Request
                  </button>
                </div>
              )}
              <div className="mt-3">
                <button
                  onClick={() => setDetailsModal(null)}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {approvalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Approve: {approvalModal.firstName} {approvalModal.lastName}
              </h3>
              <textarea
                value={approvalMessage}
                onChange={(e) => setApprovalMessage(e.target.value)}
                className="w-full h-32 px-4 py-2 border rounded mb-4 resize-none"
                placeholder="Confirmation message"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleApproveRequest(approvalModal.id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => setApprovalModal(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {rejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Reject: {rejectionModal.firstName} {rejectionModal.lastName}
              </h3>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border rounded mb-4"
              >
                <option value="">Select rejection reason...</option>
                <option value="Documents incomplets">Documents incomplets</option>
                <option value="Informations invalides">Informations invalides</option>
                <option value="Paiement non confirmé">Paiement non confirmé</option>
                <option value="Non conformité">Non conformité</option>
                <option value="Autre">Autre</option>
              </select>
              <textarea
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                className="w-full h-32 px-4 py-2 border rounded mb-4 resize-none"
                placeholder="Rejection message"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleRejectRequest(rejectionModal.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => setRejectionModal(null)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
