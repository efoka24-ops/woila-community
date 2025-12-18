import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: 6,
      select: false
    },
    structure: String,
    activity_sector: String,
    city: {
      type: String,
      enum: ['Garoua', 'Maroua', 'N\'Gaoundéré']
    },
    is_member: {
      type: Boolean,
      default: false
    },
    membership_date: Date,
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: String,
    bio: String,
    social_links: {
      website: String,
      linkedin: String,
      twitter: String
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
