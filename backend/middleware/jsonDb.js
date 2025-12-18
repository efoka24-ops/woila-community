const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const readJSON = (filename) => {
  try {
    const data = fs.readFileSync(path.join(dataDir, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const writeJSON = (filename, data) => {
  fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2));
};

module.exports = { readJSON, writeJSON };
