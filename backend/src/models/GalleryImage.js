import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis']
    },
    description: String,
    image_url: {
      type: String,
      required: [true, 'L\'URL de l\'image est requise']
    },
    category: {
      type: String,
      enum: ['Atelier', 'Formation', 'Networking', 'Événement', 'Autre'],
      required: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    likes: {
      type: Number,
      default: 0
    },
    published: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('GalleryImage', galleryImageSchema);
