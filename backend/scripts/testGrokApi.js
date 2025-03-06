/**
 * Script pour tester l'appel à l'API Grok
 * Exécuter avec: node scripts/testGrokApi.js
 */

// Charger les variables d'environnement avant d'importer le service
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

// Importer le service après avoir chargé les variables d'environnement
const grokService = require('../services/grokService');

// Données de test
const testData = {
  scores: {
    extraversion: 3.5,
    nevrosisme: 2.8,
    agreabilite: 4.2,
    conscience: 3.9,
    ouverture: 4.7
  },
  responses: {
    q1: 4,
    q2: 2,
    q3: 5,
    q4: 3,
    q5: 4
  }
};

// Fonction principale
async function testGrokApi() {
  console.log('=== Test de l\'API Grok ===');
  console.log('Envoi des données de test:', JSON.stringify(testData, null, 2));
  
  try {
    console.log('\nAppel de l\'API Grok...');
    const result = await grokService.analyzeBigFiveResponses(testData);
    
    if (!result) {
      console.log('\n❌ Échec: Aucun résultat retourné');
    } else if (result.error) {
      console.log('\n❌ Échec: Erreur retournée par le service');
      console.log('Message d\'erreur:', result.message);
      console.log('Détails:', result.details);
    } else {
      console.log('\n✅ Succès: Analyse reçue de l\'API Grok');
      
      // Afficher uniquement l'analyse textuelle
      console.log('\n=== ANALYSE TEXTUELLE ===');
      console.log(result.analysis);
      console.log('=== FIN DE L\'ANALYSE ===');
      
      // Afficher les informations techniques en mode debug
      console.log('\n[DEBUG] Informations techniques:');
      console.log('- Modèle utilisé:', result.model);
      console.log('- Tokens utilisés:', result.usage?.total_tokens || 'N/A');
    }
  } catch (error) {
    console.error('\n❌ Exception lors de l\'appel:', error);
  }
  
  console.log('\n=== Fin du test ===');
}

// Exécuter le test
testGrokApi(); 