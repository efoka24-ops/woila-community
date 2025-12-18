import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    summary: {
      type: String,
      required: [true, 'Un résumé est requis']
    },
    content: {
      type: String,
      required: [true, 'Le contenu est requis']
    },
    image_url: String,
    category: {
      type: String,
      enum: ['Événement', 'Formation', 'Opportunité', 'Portrait', 'Annonce'],
      default: 'Annonce'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    published: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    tags: [String]
  },
  { timestamps: true }
);

// Auto-generate slug
blogPostSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

export default mongoose.model('BlogPost', blogPostSchema);
