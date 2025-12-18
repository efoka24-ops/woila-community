const { readJSON, writeJSON } = require('../middleware/jsonDb');

const memberController = {
  // Créer un membre
  create: (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, activitySector, city } = req.body;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      const data = readJSON('members.json');
      
      if (data.members.some(m => m.email === email)) {
        return res.status(400).json({ error: 'Email déjà enregistré' });
      }

      const newMember = {
        id: `member_${Date.now()}`,
        firstName,
        lastName,
        email,
        phone,
        company,
        activitySector,
        city,
        status: 'pending',
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      data.members.push(newMember);
      writeJSON('members.json', data);

      res.status(201).json({ 
        message: 'Adhésion créée avec succès',
        member: newMember 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer tous les membres
  getAll: (req, res) => {
    try {
      const data = readJSON('members.json');
      res.json(data.members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Récupérer un membre
  getById: (req, res) => {
    try {
      const data = readJSON('members.json');
      const member = data.members.find(m => m.id === req.params.id);
      
      if (!member) {
        return res.status(404).json({ error: 'Membre non trouvé' });
      }

      res.json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour un membre
  update: (req, res) => {
    try {
      const data = readJSON('members.json');
      const memberIndex = data.members.findIndex(m => m.id === req.params.id);
      
      if (memberIndex === -1) {
        return res.status(404).json({ error: 'Membre non trouvé' });
      }

      data.members[memberIndex] = {
        ...data.members[memberIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      writeJSON('members.json', data);
      res.json(data.members[memberIndex]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Supprimer un membre
  delete: (req, res) => {
    try {
      const data = readJSON('members.json');
      data.members = data.members.filter(m => m.id !== req.params.id);
      writeJSON('members.json', data);
      res.json({ message: 'Membre supprimé' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = memberController;
