const { readJSON, writeJSON } = require('../middleware/jsonDb');

const eventController = {
  // Créer un événement
  create: (req, res) => {
    try {
      const { title, description, date, location, city, category, capacity, imageUrl, image_url } = req.body;

      if (!title || !date) {
        return res.status(400).json({ error: 'Titre et date requis' });
      }

      const data = readJSON('events.json');
      if (!data.events) data.events = [];
      
      const newEvent = {
        id: `event_${Date.now()}`,
        title,
        description,
        date,
        location: location || city,
        city: city || location,
        category: category || 'Other',
        capacity: parseInt(capacity) || 0,
        imageUrl: imageUrl || image_url,
        registrations: [],
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

  // Récupérer tous les événements (admin view - inclut tous)
  getAll: (req, res) => {
    try {
      const data = readJSON('events.json');
      const { search } = req.query;
      let events = data.events || [];
      
      if (search) {
        events = events.filter(e => 
          e.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      
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

      // Initialiser registrations si vide
      if (!event.registrations) event.registrations = [];

      if (event.registrations.some(a => a.email === email)) {
        return res.status(400).json({ error: 'Vous êtes déjà inscrit' });
      }

      // Vérifier si places disponibles
      if (event.capacity && event.registrations.length >= event.capacity) {
        return res.status(400).json({ error: 'Aucune place disponible' });
      }

      event.registrations.push({ email, firstName, lastName, registeredAt: new Date().toISOString() });
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

  // Mettre à jour une inscription
  updateRegistration: (req, res) => {
    try {
      const { email } = req.params;
      const { status, notes } = req.body;
      const data = readJSON('events.json');
      const event = data.events.find(e => e.id === req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      if (!event.registrations) event.registrations = [];

      const registration = event.registrations.find(r => r.email === email);
      if (!registration) {
        return res.status(404).json({ error: 'Inscription non trouvée' });
      }

      if (status) registration.status = status;
      if (notes !== undefined) registration.notes = notes;
      registration.updatedAt = new Date().toISOString();

      writeJSON('events.json', data);
      res.json({ message: 'Inscription mise à jour', registration });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Envoyer une confirmation
  sendConfirmation: (req, res) => {
    try {
      const { email } = req.params;
      const { message, subject } = req.body;
      const data = readJSON('events.json');
      const event = data.events.find(e => e.id === req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      if (!event.registrations) event.registrations = [];

      const registration = event.registrations.find(r => r.email === email);
      if (!registration) {
        return res.status(404).json({ error: 'Inscription non trouvée' });
      }

      // Créer une notification/email dans un fichier de notifications
      const notificationsData = require('../middleware/jsonDb').readJSON('notifications.json');
      notificationsData.notifications = notificationsData.notifications || [];

      notificationsData.notifications.push({
        id: `notif_${Date.now()}`,
        eventId: event.id,
        email: email,
        firstName: registration.firstName,
        lastName: registration.lastName,
        subject: subject,
        message: message,
        status: 'pending', // pending, sent, failed
        createdAt: new Date().toISOString(),
        sentAt: null
      });

      // Mettre à jour le statut de l'inscription
      registration.status = 'confirmed';
      registration.confirmationSentAt = new Date().toISOString();

      require('../middleware/jsonDb').writeJSON('events.json', data);
      require('../middleware/jsonDb').writeJSON('notifications.json', notificationsData);

      res.json({ 
        message: 'Confirmation enregistrée et à envoyer',
        confirmation: notificationsData.notifications[notificationsData.notifications.length - 1]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer une inscription
  deleteRegistration: (req, res) => {
    try {
      const { email } = req.params;
      const data = readJSON('events.json');
      const event = data.events.find(e => e.id === req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      if (!event.registrations) event.registrations = [];

      const initialLength = event.registrations.length;
      event.registrations = event.registrations.filter(r => r.email !== email);

      if (event.registrations.length === initialLength) {
        return res.status(404).json({ error: 'Inscription non trouvée' });
      }

      writeJSON('events.json', data);
      res.json({ message: 'Inscription supprimée', event });
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
