import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminBlog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', summary: '', content: '', category: 'Event', imageUrl: '' });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchArticles();
  }, [search, categoryFilter, statusFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/blog?';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('published', statusFilter === 'published');
      
      url += params.toString();
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.content) {
      setError('Titre et contenu requis');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/blog/${editingId}`
        : 'http://localhost:5000/api/blog';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...form, 
          published: editingId ? undefined : false 
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      setSuccess(editingId ? 'Article mis à jour!' : 'Article créé!');
      setForm({ title: '', summary: '', content: '', category: 'Annonce', imageUrl: '' });
      setEditingId(null);
      setShowForm(false);
      
      setTimeout(() => {
        setSuccess('');
        fetchArticles();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors de la création');
    }
  };

  const handleEdit = (article) => {
    setForm(article);
    setEditingId(article.id);
    setShowForm(true);
  };

  const handlePublish = async (id, published) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ published: !published })
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete article?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/blog/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ title: '', summary: '', content: '', category: 'Event', imageUrl: '' });
              setShowForm(!showForm);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : '+ New Article'}
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
              <input
                type="text"
                placeholder="Summary"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2 border rounded h-32"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="px-4 py-2 border rounded"
                >
                  <option>Event</option>
                  <option>Training</option>
                  <option>Opportunity</option>
                  <option>Portrait</option>
                  <option>News</option>
                </select>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="px-4 py-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                {editingId ? 'Update Article' : 'Create Article'}
              </button>
            </form>
          </div>
        )}

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Categories</option>
            <option value="Event">Event</option>
            <option value="Training">Training</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Portrait">Portrait</option>
            <option value="News">News</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{article.title}</td>
                    <td className="px-4 py-3">{article.category}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublish(article.id, article.published)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        {article.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
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
    </AdminLayout>
  );
}
