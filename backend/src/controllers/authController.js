import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, activity_sector, city } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Create user
    const user = new User({
      first_name,
      last_name,
      email,
      phone,
      password,
      activity_sector,
      city
    });

    await user.save();

    const token = generateToken(user._id, user.email);
    
    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = generateToken(user._id, user.email);

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, activity_sector, city, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { first_name, last_name, phone, activity_sector, city, bio },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
