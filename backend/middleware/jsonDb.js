const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const readJSON = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    
    // Initialiser les structures vides si nécessaire
    if (filename === 'members.json' && !parsed.members) {
      parsed.members = [];
    }
    if (filename === 'blog.json' && !parsed.posts) {
      parsed.posts = [];
    }
    if (filename === 'events.json' && !parsed.events) {
      parsed.events = [];
    }
    if (filename === 'contact.json' && !parsed.messages) {
      parsed.messages = [];
    }
    if (filename === 'users.json' && !parsed.users) {
      parsed.users = [];
    }
    if (filename === 'membership_requests.json' && !parsed.requests) {
      parsed.requests = [];
    }
    
    return parsed;
  } catch (error) {
    // Retourner structure par défaut si le fichier n'existe pas
    if (filename === 'members.json') return { members: [] };
    if (filename === 'blog.json') return { posts: [] };
    if (filename === 'events.json') return { events: [] };
    if (filename === 'contact.json') return { messages: [] };
    if (filename === 'users.json') return { users: [] };
    if (filename === 'membership_requests.json') return { requests: [] };
    return {};
  }
};

const writeJSON = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Erreur d'écriture dans ${filename}:`, error.message);
  }
};

module.exports = { readJSON, writeJSON };
