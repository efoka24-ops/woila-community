const { readJSON, writeJSON } = require('../middleware/jsonDb');

const membershipController = {
  // Créer une demande d'inscription
  createRequest: (req, res) => {
    try {
      const { firstName, lastName, email, phone, structure, activitySector, city, paymentProofUrl } = req.body;

      // Validation détaillée
      if (!firstName || !firstName.toString().trim()) {
        return res.status(400).json({ error: 'Prénom requis' });
      }
      if (!lastName || !lastName.toString().trim()) {
        return res.status(400).json({ error: 'Nom requis' });
      }
      if (!email || !email.toString().trim()) {
        return res.status(400).json({ error: 'Email requis' });
      }
      if (!phone || !phone.toString().trim()) {
        return res.status(400).json({ error: 'Téléphone requis' });
      }
      if (!city || !city.toString().trim()) {
        return res.status(400).json({ error: 'Ville requise' });
      }

      const data = readJSON('membership_requests.json');
      if (!data.requests) data.requests = [];

      // Vérifier si un email est déjà enregistré
      const existingRequest = data.requests.find(r => r.email.toLowerCase() === email.toLowerCase());
      if (existingRequest) {
        return res.status(400).json({ error: 'Cet email est déjà enregistré' });
      }

      const newRequest = {
        id: `mem_${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        structure: (structure || '').trim(),
        activitySector: (activitySector || '').trim(),
        city: city.trim(),
        paymentProofUrl: paymentProofUrl || '',
        status: 'pending', // pending, approved, rejected
        rejectionReason: '',
        approvalDate: null,
        rejectionDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.requests.push(newRequest);
      writeJSON('membership_requests.json', data);

      res.status(201).json({ 
        message: 'Demande d\'inscription créée avec succès',
        request: newRequest 
      });
    } catch (error) {
      console.error('Error creating membership request:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer toutes les demandes (admin)
  getAll: (req, res) => {
    try {
      const data = readJSON('membership_requests.json');
      const { status, search } = req.query;
      let requests = data.requests || [];

      // Filtrer par statut
      if (status && status !== 'all') {
        requests = requests.filter(r => r.status === status);
      }

      // Filtrer par recherche
      if (search) {
        requests = requests.filter(r =>
          r.firstName.toLowerCase().includes(search.toLowerCase()) ||
          r.lastName.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          r.city.toLowerCase().includes(search.toLowerCase())
        );
      }

      res.json(requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer une demande
  getById: (req, res) => {
    try {
      const data = readJSON('membership_requests.json');
      const request = data.requests.find(r => r.id === req.params.id);

      if (!request) {
        return res.status(404).json({ error: 'Demande non trouvée' });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Approuver une demande
  approve: (req, res) => {
    try {
      const { confirmationMessage } = req.body;
      const data = readJSON('membership_requests.json');
      const request = data.requests.find(r => r.id === req.params.id);

      if (!request) {
        return res.status(404).json({ error: 'Demande non trouvée' });
      }

      request.status = 'approved';
      request.approvalDate = new Date().toISOString();
      request.updatedAt = new Date().toISOString();

      // Sauvegarder la demande
      writeJSON('membership_requests.json', data);

      // Créer un notification pour l'email de confirmation
      const notificationsData = require('../middleware/jsonDb').readJSON('notifications.json');
      notificationsData.notifications = notificationsData.notifications || [];

      notificationsData.notifications.push({
        id: `notif_${Date.now()}`,
        type: 'membership_approval',
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        subject: 'Bienvenue à Woila Community!',
        message: confirmationMessage || `
Bonjour ${request.firstName} ${request.lastName},

Nous sommes heureux de vous accueillir dans la communauté Woila Community!

Votre demande d'inscription a été approuvée avec succès.

Vous pouvez maintenant accéder à tous les avantages et opportunités disponibles pour nos membres.

Bienvenue dans la famille Woila Community!

Cordialement,
L'équipe Woila Community`,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      require('../middleware/jsonDb').writeJSON('notifications.json', notificationsData);

      res.json({ 
        message: 'Demande approuvée et confirmation envoyée',
        request 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Rejeter une demande
  reject: (req, res) => {
    try {
      const { rejectionReason, rejectionMessage } = req.body;
      const data = readJSON('membership_requests.json');
      const request = data.requests.find(r => r.id === req.params.id);

      if (!request) {
        return res.status(404).json({ error: 'Demande non trouvée' });
      }

      request.status = 'rejected';
      request.rejectionReason = rejectionReason || 'Non spécifié';
      request.rejectionDate = new Date().toISOString();
      request.updatedAt = new Date().toISOString();

      // Sauvegarder la demande
      writeJSON('membership_requests.json', data);

      // Créer une notification pour l'email de rejet
      const notificationsData = require('../middleware/jsonDb').readJSON('notifications.json');
      notificationsData.notifications = notificationsData.notifications || [];

      notificationsData.notifications.push({
        id: `notif_${Date.now()}`,
        type: 'membership_rejection',
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        subject: 'Demande d\'inscription - Woila Community',
        message: rejectionMessage || `
Bonjour ${request.firstName} ${request.lastName},

Nous avons examiné votre demande d'inscription à Woila Community.

Malheureusement, votre demande a été rejetée pour la raison suivante:
${rejectionReason || 'Non spécifié'}

Si vous pensez qu'il y a une erreur ou si vous souhaitez réessayer, veuillez nous contacter.

Cordialement,
L'équipe Woila Community`,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      require('../middleware/jsonDb').writeJSON('notifications.json', notificationsData);

      res.json({ 
        message: 'Demande rejetée et notification envoyée',
        request 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer une demande
  delete: (req, res) => {
    try {
      const data = readJSON('membership_requests.json');
      data.requests = data.requests.filter(r => r.id !== req.params.id);
      writeJSON('membership_requests.json', data);
      res.json({ message: 'Demande supprimée' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = membershipController;
