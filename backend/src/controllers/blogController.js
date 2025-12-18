import BlogPost from '../models/BlogPost.js';

export const getAllPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { published: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await BlogPost.find(filter)
      .populate('author', 'first_name last_name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'first_name last_name avatar email');

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, summary, content, category, image_url, tags } = req.body;

    const post = new BlogPost({
      title,
      summary,
      content,
      category,
      image_url,
      tags,
      author: req.user.id,
      published: req.user.role === 'admin'
    });

    await post.save();
    await post.populate('author', 'first_name last_name avatar');

    res.status(201).json({ message: 'Article créé', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.json({ message: 'Article mis à jour', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Article supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
