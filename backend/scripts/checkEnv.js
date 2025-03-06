/**
 * Script pour vérifier les variables d'environnement
 * Exécuter avec: node scripts/checkEnv.js
 */

// Charger les variables d'environnement
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger en priorité depuis .env.local s'il existe
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  console.log('Chargement des variables depuis .env.local');
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  console.log('Chargement des variables depuis .env');
  dotenv.config({ path: envPath });
} else {
  console.warn('Aucun fichier .env ou .env.local trouvé');
}

// Afficher les variables d'environnement
console.log('=== Variables d\'environnement ===');
console.log('GROK_API_KEY:', process.env.GROK_API_KEY ? '****' + process.env.GROK_API_KEY.slice(-4) : 'Non définie');
console.log('GROK_API_URL:', process.env.GROK_API_URL || 'Non définie');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Non définie');

// Afficher toutes les variables d'environnement commençant par certains préfixes
console.log('\n=== Toutes les variables pertinentes ===');
Object.keys(process.env)
  .filter(key => key.startsWith('GROK_') || key.startsWith('MONGODB_') || key.startsWith('OPENAI_'))
  .forEach(key => {
    const value = key.includes('KEY') || key.includes('PWD') 
      ? '****' + (process.env[key]?.slice(-4) || '')
      : process.env[key];
    
    console.log(`${key}: ${value || 'Non définie'}`);
  });

console.log('\n=== Fin de la vérification ==='); 