// backend/middleware/validation.js
// Validation middleware pour tous les endpoints

import { body, param, query, validationResult } from 'express-validator';

// Middleware pour gérer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// ===== AUTH VALIDATION =====
export const validateRegister = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2 }).withMessage('Le prénom doit faire au moins 2 caractères'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit faire au moins 2 caractères'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis'),
  handleValidationErrors
];

// ===== MEMBER VALIDATION =====
export const validateMemberCreate = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('Le prénom est requis')
    .isLength({ min: 2 }).withMessage('Le prénom doit faire au moins 2 caractères'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit faire au moins 2 caractères'),
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Numéro de téléphone invalide'),
  body('company')
    .trim()
    .notEmpty().withMessage('La société est requise'),
  body('activitySector')
    .trim()
    .notEmpty().withMessage('Le secteur d\'activité est requis')
    .isIn(['Commerce', 'Technologie', 'Services', 'Industrie', 'Agriculture', 'Autre'])
    .withMessage('Secteur d\'activité invalide'),
  body('city')
    .trim()
    .notEmpty().withMessage('La ville est requise')
    .isIn(['Garoua', 'Maroua', 'N\'Gaoundéré', 'Autre'])
    .withMessage('Ville invalide'),
  handleValidationErrors
];

export const validateMemberUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le prénom doit faire au moins 2 caractères'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Le nom doit faire au moins 2 caractères'),
  body('email')
    .optional()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

export const validateMemberId = [
  param('id')
    .notEmpty().withMessage('ID requis')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('ID invalide'),
  handleValidationErrors
];

// ===== BLOG VALIDATION =====
export const validateBlogCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis')
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit faire entre 5 et 200 caractères'),
  body('summary')
    .trim()
    .notEmpty().withMessage('Le résumé est requis')
    .isLength({ min: 10, max: 500 }).withMessage('Le résumé doit faire entre 10 et 500 caractères'),
  body('content')
    .trim()
    .notEmpty().withMessage('Le contenu est requis')
    .isLength({ min: 50 }).withMessage('Le contenu doit faire au moins 50 caractères'),
  body('category')
    .trim()
    .notEmpty().withMessage('La catégorie est requise')
    .isIn(['Événement', 'Formation', 'Opportunité', 'Portrait', 'Annonce'])
    .withMessage('Catégorie invalide'),
  body('imageUrl')
    .optional()
    .isURL().withMessage('URL d\'image invalide'),
  handleValidationErrors
];

export const validateBlogUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit faire entre 5 et 200 caractères'),
  body('summary')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('Le résumé doit faire entre 10 et 500 caractères'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 }).withMessage('Le contenu doit faire au moins 50 caractères'),
  body('category')
    .optional()
    .trim()
    .isIn(['Événement', 'Formation', 'Opportunité', 'Portrait', 'Annonce'])
    .withMessage('Catégorie invalide'),
  handleValidationErrors
];

// ===== EVENT VALIDATION =====
export const validateEventCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis')
    .isLength({ min: 5, max: 200 }).withMessage('Le titre doit faire entre 5 et 200 caractères'),
  body('description')
    .trim()
    .notEmpty().withMessage('La description est requise'),
  body('date')
    .notEmpty().withMessage('La date est requise')
    .isISO8601().withMessage('Format de date invalide'),
  body('location')
    .trim()
    .notEmpty().withMessage('Le lieu est requis'),
  body('capacity')
    .isInt({ min: 1 }).withMessage('La capacité doit être un nombre positif'),
  body('category')
    .trim()
    .notEmpty().withMessage('La catégorie est requise')
    .isIn(['Formation', 'Networking', 'Conférence', 'Atelier', 'Autre'])
    .withMessage('Catégorie invalide'),
  handleValidationErrors
];

export const validateEventRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit faire au moins 2 caractères'),
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

// ===== CONTACT VALIDATION =====
export const validateContactCreate = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit faire au moins 2 caractères'),
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Numéro de téléphone invalide'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Le sujet est requis')
    .isLength({ min: 5, max: 100 }).withMessage('Le sujet doit faire entre 5 et 100 caractères'),
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10 }).withMessage('Le message doit faire au moins 10 caractères'),
  handleValidationErrors
];

// ===== PAGINATION VALIDATION =====
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Le numéro de page doit être au moins 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100'),
  handleValidationErrors
];

// ===== SEARCH/FILTER VALIDATION =====
export const validateSearchFilters = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('La recherche doit faire au moins 2 caractères'),
  query('category')
    .optional()
    .trim(),
  query('city')
    .optional()
    .trim(),
  query('sort')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Tri invalide'),
  handleValidationErrors
];
