const { readJSON, writeJSON } = require('../middleware/jsonDb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  // Enregistrement
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const userData = readJSON('users.json');
      
      if (userData.users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      userData.users.push(newUser);
      writeJSON('users.json', userData);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );

      res.status(201).json({ 
        message: 'Utilisateur créé',
        token,
        user: { id: newUser.id, email: newUser.email, firstName, lastName }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Connexion
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const userData = readJSON('users.json');
      const user = userData.users.find(u => u.email === email);

      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );

      res.json({ 
        message: 'Connexion réussie',
        token,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer l'utilisateur actuel
  me: (req, res) => {
    try {
      const userData = readJSON('users.json');
      const user = userData.users.find(u => u.id === req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;
