const { readJSON, writeJSON } = require('../middleware/jsonDb');

const contactController = {
  // Créer un message de contact
  create: (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Nom, email et message requis' });
      }

      const data = readJSON('contact.json');
      const newMessage = {
        id: `contact_${Date.now()}`,
        name,
        email,
        phone,
        subject,
        message,
        status: 'unread',
        createdAt: new Date().toISOString()
      };

      data.messages.push(newMessage);
      writeJSON('contact.json', data);

      res.status(201).json({ 
        message: 'Message envoyé avec succès',
        contact: newMessage 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer tous les messages
  getAll: (req, res) => {
    try {
      const data = readJSON('contact.json');
      res.json(data.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Marquer comme lu
  markAsRead: (req, res) => {
    try {
      const data = readJSON('contact.json');
      const message = data.messages.find(m => m.id === req.params.id);
      
      if (!message) {
        return res.status(404).json({ error: 'Message non trouvé' });
      }

      message.status = 'read';
      writeJSON('contact.json', data);
      res.json({ message: 'Message marqué comme lu', contact: message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un message
  delete: (req, res) => {
    try {
      const data = readJSON('contact.json');
      data.messages = data.messages.filter(m => m.id !== req.params.id);
      writeJSON('contact.json', data);
      res.json({ message: 'Message supprimé' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = contactController;
