import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis']
    },
    description: {
      type: String,
      required: [true, 'La description est requise']
    },
    date: {
      type: Date,
      required: [true, 'La date est requise']
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: String,
    location: {
      type: String,
      required: true
    },
    city: {
      type: String,
      enum: ['Garoua', 'Maroua', 'N\'Gaoundéré'],
      required: true
    },
    category: {
      type: String,
      enum: ['Formation', 'Networking', 'Conférence', 'Atelier', 'Autre'],
      default: 'Autre'
    },
    image_url: String,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    capacity: {
      type: Number,
      default: null
    },
    registered_count: {
      type: Number,
      default: 0
    },
    published: {
      type: Boolean,
      default: false
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    link: String,
    contact_email: String,
    contact_phone: String
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
