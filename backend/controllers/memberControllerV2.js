// backend/controllers/memberControllerV2.js
// Version améliorée avec pagination, filtres et meilleure validation

import { readJSON, writeJSON } from '../middleware/jsonDb.js';
import { v4 as uuidv4 } from 'uuid';

const MEMBERS_FILE = 'backend/data/members.json';

// ===== CREATE MEMBER =====
export const createMember = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, activitySector, city } = req.body;

    // Vérifier si email existe déjà
    const members = await readJSON(MEMBERS_FILE);
    if (members.some(m => m.email === email)) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer nouveau membre
    const newMember = {
      id: `member_${uuidv4()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      activitySector,
      city,
      status: 'active',
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    members.push(newMember);
    await writeJSON(MEMBERS_FILE, members);

    res.status(201).json({
      success: true,
      message: 'Adhésion créée avec succès',
      data: newMember
    });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'adhésion'
    });
  }
};

// ===== GET ALL MEMBERS WITH PAGINATION & FILTERS =====
export const getMembers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      activitySector,
      status = 'active',
      sort = 'desc'
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Lire tous les membres
    let members = await readJSON(MEMBERS_FILE);

    // Appliquer les filtres
    members = members.filter(member => {
      // Filtre status
      if (status && member.status !== status) return false;

      // Filtre ville
      if (city && member.city !== city) return false;

      // Filtre secteur
      if (activitySector && member.activitySector !== activitySector) return false;

      // Filtre recherche (prénom, nom, email, société)
      if (search) {
        const searchLower = search.toLowerCase();
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          member.email.includes(searchLower) ||
          member.company.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    // Appliquer le tri
    members = members.sort((a, b) => {
      const dateA = new Date(a.joinedAt);
      const dateB = new Date(b.joinedAt);
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Récupérer le total avant pagination
    const total = members.length;

    // Appliquer la pagination
    const paginatedMembers = members.slice(offset, offset + limitNum);

    res.json({
      success: true,
      data: paginatedMembers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des membres'
    });
  }
};

// ===== GET MEMBER BY ID =====
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await readJSON(MEMBERS_FILE);
    const member = members.find(m => m.id === id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du membre'
    });
  }
};

// ===== UPDATE MEMBER =====
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const members = await readJSON(MEMBERS_FILE);
    const memberIndex = members.findIndex(m => m.id === id);

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé'
      });
    }

    // Vérifier l'unicité du nouvel email
    if (updates.email && updates.email !== members[memberIndex].email) {
      if (members.some(m => m.email === updates.email && m.id !== id)) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }
    }

    // Mettre à jour le membre
    const updatedMember = {
      ...members[memberIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      id: members[memberIndex].id, // Empêcher modification de l'ID
      joinedAt: members[memberIndex].joinedAt // Empêcher modification de la date de création
    };

    members[memberIndex] = updatedMember;
    await writeJSON(MEMBERS_FILE, members);

    res.json({
      success: true,
      message: 'Membre mis à jour avec succès',
      data: updatedMember
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du membre'
    });
  }
};

// ===== DELETE MEMBER =====
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await readJSON(MEMBERS_FILE);
    const memberIndex = members.findIndex(m => m.id === id);

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé'
      });
    }

    const deletedMember = members[memberIndex];
    members.splice(memberIndex, 1);
    await writeJSON(MEMBERS_FILE, members);

    res.json({
      success: true,
      message: 'Membre supprimé avec succès',
      data: deletedMember
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du membre'
    });
  }
};

// ===== UTILITY FUNCTIONS =====

// Obtenir statistiques des membres
export const getMemberStats = async (req, res) => {
  try {
    const members = await readJSON(MEMBERS_FILE);

    const stats = {
      total: members.length,
      byCity: {},
      bySector: {},
      joined: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      }
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    members.forEach(member => {
      // Par ville
      stats.byCity[member.city] = (stats.byCity[member.city] || 0) + 1;

      // Par secteur
      stats.bySector[member.activitySector] = (stats.bySector[member.activitySector] || 0) + 1;

      // Par date
      const joinDate = new Date(member.joinedAt);
      if (joinDate >= today) stats.joined.today++;
      if (joinDate >= weekAgo) stats.joined.thisWeek++;
      if (joinDate >= monthAgo) stats.joined.thisMonth++;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

// Exporter dans CSV (optionnel)
export const exportMembers = async (req, res) => {
  try {
    const members = await readJSON(MEMBERS_FILE);

    // Créer CSV
    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Société', 'Secteur', 'Ville', 'Date d\'adhésion'];
    const rows = members.map(m => [
      m.id,
      m.firstName,
      m.lastName,
      m.email,
      m.phone,
      m.company,
      m.activitySector,
      m.city,
      new Date(m.joinedAt).toLocaleDateString('fr-FR')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting members:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'export des membres'
    });
  }
};
