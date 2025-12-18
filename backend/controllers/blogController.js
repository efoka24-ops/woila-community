const { readJSON, writeJSON } = require('../middleware/jsonDb');

const blogController = {
  // Créer un article
  create: (req, res) => {
    try {
      const { title, summary, content, category, image_url } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Titre et contenu requis' });
      }

      const data = readJSON('blog.json');
      const newPost = {
        id: `blog_${Date.now()}`,
        title,
        summary,
        content,
        category: category || 'Annonce',
        image_url,
        author: req.user?.email || 'Anonyme',
        published: false,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.posts.push(newPost);
      writeJSON('blog.json', data);

      res.status(201).json({ message: 'Article créé', post: newPost });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer tous les articles publiés
  getAll: (req, res) => {
    try {
      const data = readJSON('blog.json');
      const posts = data.posts.filter(p => p.published);
      res.json(posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer un article
  getById: (req, res) => {
    try {
      const data = readJSON('blog.json');
      const post = data.posts.find(p => p.id === req.params.id);
      
      if (!post) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      post.views = (post.views || 0) + 1;
      writeJSON('blog.json', data);
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour un article
  update: (req, res) => {
    try {
      const data = readJSON('blog.json');
      const postIndex = data.posts.findIndex(p => p.id === req.params.id);
      
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      data.posts[postIndex] = {
        ...data.posts[postIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      writeJSON('blog.json', data);
      res.json(data.posts[postIndex]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Publier un article
  publish: (req, res) => {
    try {
      const data = readJSON('blog.json');
      const post = data.posts.find(p => p.id === req.params.id);
      
      if (!post) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      post.published = true;
      writeJSON('blog.json', data);
      res.json({ message: 'Article publié', post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un article
  delete: (req, res) => {
    try {
      const data = readJSON('blog.json');
      data.posts = data.posts.filter(p => p.id !== req.params.id);
      writeJSON('blog.json', data);
      res.json({ message: 'Article supprimé' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = blogController;
