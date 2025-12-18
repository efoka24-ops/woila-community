const { readJSON, writeJSON } = require('../middleware/jsonDb');

const eventController = {
  // Créer un événement
  create: (req, res) => {
    try {
      const { title, description, date, location, city, category, capacity, image_url } = req.body;

      if (!title || !date) {
        return res.status(400).json({ error: 'Titre et date requis' });
      }

      const data = readJSON('events.json');
      const newEvent = {
        id: `event_${Date.now()}`,
        title,
        description,
        date,
        location,
        city,
        category: category || 'Autre',
        capacity,
        image_url,
        attendees: [],
        published: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.events.push(newEvent);
      writeJSON('events.json', data);

      res.status(201).json({ message: 'Événement créé', event: newEvent });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer tous les événements publiés
  getAll: (req, res) => {
    try {
      const data = readJSON('events.json');
      const events = data.events.filter(e => e.published);
      res.json(events.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer un événement
  getById: (req, res) => {
    try {
      const data = readJSON('events.json');
      const event = data.events.find(e => e.id === req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // S'inscrire à un événement
  register: (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      const data = readJSON('events.json');
      const event = data.events.find(e => e.id === req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      if (event.attendees.some(a => a.email === email)) {
        return res.status(400).json({ error: 'Vous êtes déjà inscrit' });
      }

      event.attendees.push({ email, firstName, lastName, registeredAt: new Date().toISOString() });
      writeJSON('events.json', data);
      
      res.json({ message: 'Inscription réussie', event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour un événement
  update: (req, res) => {
    try {
      const data = readJSON('events.json');
      const eventIndex = data.events.findIndex(e => e.id === req.params.id);
      
      if (eventIndex === -1) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      data.events[eventIndex] = {
        ...data.events[eventIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      writeJSON('events.json', data);
      res.json(data.events[eventIndex]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un événement
  delete: (req, res) => {
    try {
      const data = readJSON('events.json');
      data.events = data.events.filter(e => e.id !== req.params.id);
      writeJSON('events.json', data);
      res.json({ message: 'Événement supprimé' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = eventController;
