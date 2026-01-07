import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryColors = {
    'Annonce': 'bg-blue-100 text-blue-800',
    'Formation': 'bg-green-100 text-green-800',
    'Événement': 'bg-purple-100 text-purple-800',
    'Opportunité': 'bg-orange-100 text-orange-800',
    'Portrait': 'bg-pink-100 text-pink-800'
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/blog/${id}`);
        if (!response.ok) throw new Error('Article non trouvé');
        const data = await response.json();
        setPost(data);

        // Fetch related posts
        const relatedResponse = await fetch(
          `http://localhost:5000/api/blog?published=true&category=${data.category}&limit=3`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedPosts(relatedData.filter(p => p.id !== id).slice(0, 2));
        }

        // Increment views
        await fetch(`http://localhost:5000/api/blog/${id}/views`, {
          method: 'POST'
        });
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Chargement de l'article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <Link to="/blog" className="text-purple-900 hover:text-purple-700 font-semibold">
            ← Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux articles
          </button>

          <div className="flex items-center gap-3 mb-4">
            <Badge className={`${categoryColors[post.category]} border-0`}>
              {post.category}
            </Badge>
            <span className="text-purple-200 text-sm">
              {post.views || 0} vues
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-purple-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{post.author || 'Woila Community'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-12 relative z-10">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl shadow-2xl"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {post.summary && (
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8 rounded">
              <p className="text-lg text-gray-700 font-semibold">
                {post.summary}
              </p>
            </div>
          )}

          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

        {/* Share and Actions */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Partager:</span>
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              Facebook
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              Twitter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles similaires</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/blog/${relatedPost.id}`)}
                >
                  {relatedPost.imageUrl && (
                    <div className="h-48 overflow-hidden bg-gray-200">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${categoryColors[relatedPost.category]} border-0`}>
                        {relatedPost.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(relatedPost.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-900">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedPost.summary}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ne manquez aucun article
          </h2>
          <p className="text-purple-100 mb-8">
            Rejoignez Woila Community pour rester informé de nos actualités
          </p>
          <Link
            to="/membership"
            className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
          >
            Devenir membre
          </Link>
        </div>
      </section>
    </div>
  );
}
