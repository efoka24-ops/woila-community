const { readJSON, writeJSON } = require('../middleware/jsonDb');

const memberController = {
  // Créer un membre
  create: (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, city } = req.body;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      const data = readJSON('members.json');
      if (!data.members) data.members = [];
      
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
        city,
        status: 'active',
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
      const { search, city, page = 1, limit = 10 } = req.query;
      let members = data.members || [];
      
      // Filtrer par recherche
      if (search) {
        members = members.filter(m => 
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Filtrer par ville
      if (city && city !== 'all') {
        members = members.filter(m => m.city === city);
      }
      
      // Pagination
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedMembers = members.slice(startIndex, endIndex);
      
      res.json(paginatedMembers);
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
