const bcrypt = require('bcrypt');
const { readJSON, writeJSON } = require('./middleware/jsonDb');

async function createAdmin() {
  try {
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Generated hash:', hashedPassword);

    const userData = readJSON('users.json');
    
    // Mettre à jour l'utilisateur admin existant
    const adminIndex = userData.users.findIndex(u => u.email === 'admin@woila.com');
    if (adminIndex !== -1) {
      userData.users[adminIndex].password = hashedPassword;
      writeJSON('users.json', userData);
      console.log('✅ Admin password updated successfully');
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdmin();
