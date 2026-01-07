// Configuration de l'API Backend
// À utiliser dans votre frontend React

const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = process.env.VITE_API_URL || 
  (isDevelopment 
    ? 'http://localhost:5000/api'
    : 'https://woila-community.onrender.com/api');

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/auth/me',

  // Members
  MEMBERS: '/members',
  MEMBERS_BY_ID: (id) => `/members/${id}`,

  // Blog
  BLOG: '/blog',
  BLOG_BY_ID: (id) => `/blog/${id}`,
  BLOG_PUBLISH: (id) => `/blog/${id}/publish`,

  // Events
  EVENTS: '/events',
  EVENTS_BY_ID: (id) => `/events/${id}`,
  EVENTS_REGISTER: (id) => `/events/${id}/register`,

  // Contact
  CONTACT: '/contact',
  CONTACT_BY_ID: (id) => `/contact/${id}`,
  CONTACT_MARK_READ: (id) => `/contact/${id}/read`,

  // Health
  HEALTH: '/health'
};

// Helper function pour faire des requêtes API
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Une erreur est survenue');
  }

  return response.json();
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiCall
};
