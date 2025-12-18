import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Le prénom est requis']
    },
    last_name: {
      type: String,
      required: [true, 'Le nom est requis']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis']
    },
    subject: {
      type: String,
      required: [true, 'Le sujet est requis']
    },
    message: {
      type: String,
      required: [true, 'Le message est requis'],
      minlength: [10, 'Le message doit avoir au moins 10 caractères']
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new'
    },
    replied_at: Date,
    reply: String
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
