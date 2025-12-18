import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Eye, EyeOff, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { apiCall, API_ENDPOINTS } from '../../config/api';

export default function AdminBlog() {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPublished, setFilterPublished] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchPosts();
  }, [page, search, filterCategory, filterPublished]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        published: filterPublished || 'all',
        ...(search && { search }),
        ...(filterCategory && { category: filterCategory })
      });

      const response = await apiCall(
        `${API_ENDPOINTS.BLOG.LIST}?${params}`
      );

      setPost(response.data);
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

      if (editingId) {
        await apiCall(API_ENDPOINTS.BLOG.UPDATE(editingId), {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        setSuccess('Article mis à jour');
      } else {
        await apiCall(API_ENDPOINTS.BLOG.CREATE, {
          method: 'POST',
          body: JSON.stringify(data)
        });
        setSuccess('Article créé (en brouillon)');
      }

      fetchPosts();
      setShowForm(false);
      setEditingId(null);
      reset();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async (id) => {
    try {
      await apiCall(API_ENDPOINTS.BLOG.PUBLISH(id), {
        method: 'POST'
      });
      setSuccess('Article publié');
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr?')) return;
    try {
      await apiCall(API_ENDPOINTS.BLOG.DELETE(id), {
        method: 'DELETE'
      });
      setSuccess('Article supprimé');
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion du Blog</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              reset();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Toutes les catégories</option>
              <option value="Événement">Événement</option>
              <option value="Formation">Formation</option>
              <option value="Opportunité">Opportunité</option>
              <option value="Portrait">Portrait</option>
              <option value="Annonce">Annonce</option>
            </select>
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Publiés</option>
              <option value="false">Brouillons</option>
            </select>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Modifier l\'article' : 'Créer un article'}
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
                <label className="block text-sm font-medium mb-2">Résumé</label>
                <textarea
                  {...register('summary', { required: 'Requis' })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contenu</label>
                <textarea
                  {...register('content', { required: 'Requis' })}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Événement">Événement</option>
                    <option value="Formation">Formation</option>
                    <option value="Opportunité">Opportunité</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Annonce">Annonce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL Image</label>
                  <input
                    {...register('imageUrl')}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vues</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">Chargement...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Aucun article</td>
                </tr>
              ) : (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{post.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.views || 0}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      {!post.published && (
                        <button
                          onClick={() => handlePublish(post.id)}
                          className="text-green-600 hover:text-green-700"
                          title="Publier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          reset(post);
                          setEditingId(post.id);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
      </div>
    </AdminLayout>
  );
}
