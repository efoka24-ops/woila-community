// backend/controllers/blogControllerV2.js
// Version améliorée avec pagination, filtres, recherche et statistiques

import { readJSON, writeJSON } from '../middleware/jsonDb.js';
import { v4 as uuidv4 } from 'uuid';

const BLOG_FILE = 'backend/data/blog.json';

// ===== CREATE BLOG POST =====
export const createPost = async (req, res) => {
  try {
    const { title, summary, content, category, imageUrl } = req.body;

    const posts = await readJSON(BLOG_FILE);

    const newPost = {
      id: `blog_${uuidv4()}`,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      category,
      imageUrl: imageUrl || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(title),
      author: req.user?.email || 'admin',
      published: false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(newPost);
    await writeJSON(BLOG_FILE, posts);

    res.status(201).json({
      success: true,
      message: 'Article créé avec succès (en brouillon)',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'article'
    });
  }
};

// ===== GET ALL BLOG POSTS WITH PAGINATION & FILTERS =====
export const getPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      author,
      sort = 'desc', // date | views | relevance
      published = 'true'
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Lire tous les articles
    let posts = await readJSON(BLOG_FILE);

    // Appliquer les filtres
    posts = posts.filter(post => {
      // Filtre publication
      const isPub = published === 'true' || published === 'all';
      if (published !== 'all' && post.published !== (published === 'true')) return false;

      // Filtre catégorie
      if (category && post.category !== category) return false;

      // Filtre auteur
      if (author && post.author !== author) return false;

      // Filtre recherche (titre, résumé, contenu)
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.summary.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    // Appliquer le tri
    if (sort === 'views') {
      posts = posts.sort((a, b) => b.views - a.views);
    } else if (sort === 'relevance' && search) {
      // Score de pertinence basé sur la position du match
      posts = posts.map(post => {
        const searchLower = search.toLowerCase();
        let score = 0;
        if (post.title.toLowerCase().includes(searchLower)) score += 3;
        if (post.summary.toLowerCase().includes(searchLower)) score += 2;
        if (post.content.toLowerCase().includes(searchLower)) score += 1;
        return { ...post, _score: score };
      }).sort((a, b) => b._score - a._score).map(({ _score, ...post }) => post);
    } else {
      // Tri par date (défaut)
      posts = posts.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    // Récupérer le total avant pagination
    const total = posts.length;

    // Appliquer la pagination
    const paginatedPosts = posts.slice(offset, offset + limitNum).map(post => ({
      ...post,
      contentPreview: post.content.substring(0, 150) + '...'
    }));

    res.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des articles'
    });
  }
};

// ===== GET POST BY ID =====
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await readJSON(BLOG_FILE);
    const post = posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    // Incrémenter les vues
    post.views += 1;
    const postIndex = posts.findIndex(p => p.id === id);
    posts[postIndex] = post;
    await writeJSON(BLOG_FILE, posts);

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'article'
    });
  }
};

// ===== UPDATE POST =====
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const posts = await readJSON(BLOG_FILE);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    // Mettre à jour l'article
    const updatedPost = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      id: posts[postIndex].id,
      createdAt: posts[postIndex].createdAt,
      views: posts[postIndex].views
    };

    posts[postIndex] = updatedPost;
    await writeJSON(BLOG_FILE, posts);

    res.json({
      success: true,
      message: 'Article mis à jour avec succès',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l\'article'
    });
  }
};

// ===== PUBLISH POST =====
export const publishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await readJSON(BLOG_FILE);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    posts[postIndex].published = true;
    posts[postIndex].updatedAt = new Date().toISOString();
    await writeJSON(BLOG_FILE, posts);

    res.json({
      success: true,
      message: 'Article publié avec succès',
      data: posts[postIndex]
    });
  } catch (error) {
    console.error('Error publishing blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la publication de l\'article'
    });
  }
};

// ===== DELETE POST =====
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await readJSON(BLOG_FILE);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    const deletedPost = posts[postIndex];
    posts.splice(postIndex, 1);
    await writeJSON(BLOG_FILE, posts);

    res.json({
      success: true,
      message: 'Article supprimé avec succès',
      data: deletedPost
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'article'
    });
  }
};

// ===== UTILITY FUNCTIONS =====

// Obtenir statistiques du blog
export const getBlogStats = async (req, res) => {
  try {
    const posts = await readJSON(BLOG_FILE);

    const stats = {
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.published).length,
      draftPosts: posts.filter(p => !p.published).length,
      totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
      byCategory: {},
      topPosts: []
    };

    posts.forEach(post => {
      stats.byCategory[post.category] = (stats.byCategory[post.category] || 0) + 1;
    });

    // Top 5 articles les plus lus
    stats.topPosts = posts
      .filter(p => p.published)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        views: p.views
      }));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

// Obtenir catégories disponibles
export const getCategories = async (req, res) => {
  try {
    const posts = await readJSON(BLOG_FILE);
    const categories = [...new Set(posts.map(p => p.category))];

    res.json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des catégories'
    });
  }
};
