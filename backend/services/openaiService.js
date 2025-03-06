const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Charger les variables d'environnement en priorité depuis .env.local s'il existe
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

/**
 * Service pour interagir avec l'API OpenAI
 */
class OpenAIService {
  constructor() {
    // Configuration OpenAI
    this.apiUrl = 'https://api.openai.com/v1';
    this.apiKey = process.env.OPENAI_API_KEY;
    
    // Créer une instance axios
    this.axiosInstance = axios.create({
      timeout: 30000 // Timeout de 30 secondes
    });
    
    // Log de débogage pour la configuration
    console.log('Service OpenAI initialisé:');
    console.log('- Clé API configurée:', this.apiKey ? 'Oui' : 'Non');
    
    if (!this.apiKey) {
      console.error('ATTENTION: Clé API OpenAI non configurée dans .env.local');
    }
  }

  /**
   * Analyse les réponses d'un test Big Five avec OpenAI
   * @param {Object} data - Les données du test (réponses, scores, etc.)
   * @returns {Promise<string>} - L'analyse textuelle d'OpenAI
   */
  async analyzeBigFiveResponses(data) {
    try {
      // Vérification de la clé API
      if (!this.apiKey) {
        console.error('Erreur: Clé API OpenAI non configurée dans les variables d\'environnement');
        return null;
      }

      console.log('Envoi de la requête à l\'API OpenAI pour analyse Big Five...');
      
      const response = await this.axiosInstance.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert en analyse de tests psychométriques Big Five (OCEAN). Analysez les résultats fournis et donnez des insights pertinents sur la personnalité du sujet.'
            },
            {
              role: 'user',
              content: `Voici les résultats d'un test Big Five: ${JSON.stringify(data)}`
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Vérification de la réponse
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        console.log('Réponse reçue de l\'API OpenAI');
        return response.data.choices[0].message.content;
      } else {
        console.error('Réponse invalide de l\'API OpenAI:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI pour Big Five:', error);
      
      // Informations détaillées sur l'erreur pour faciliter le débogage
      const errorDetails = {
        error: true,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        details: error.response?.data || 'Aucun détail disponible'
      };
      
      console.error('Détails de l\'erreur:', JSON.stringify(errorDetails, null, 2));
      
      return null;
    }
  }
  
  /**
   * Analyse les réponses d'un test RIASEC avec OpenAI
   * @param {Object} data - Les données du test (réponses, scores, etc.)
   * @returns {Promise<string>} - L'analyse textuelle d'OpenAI
   */
  async analyzeRiasecResponses(data) {
    try {
      // Vérification de la clé API
      if (!this.apiKey) {
        console.error('Erreur: Clé API OpenAI non configurée dans les variables d\'environnement');
        return null;
      }

      console.log('Envoi de la requête à l\'API OpenAI pour analyse RIASEC...');
      
      const response = await this.axiosInstance.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert en analyse de tests psychométriques RIASEC (Holland). Analysez les résultats fournis et donnez des insights pertinents sur les intérêts professionnels du sujet.'
            },
            {
              role: 'user',
              content: `Voici les résultats d'un test RIASEC: ${JSON.stringify(data)}`
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Vérification de la réponse
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        console.log('Réponse reçue de l\'API OpenAI');
        return response.data.choices[0].message.content;
      } else {
        console.error('Réponse invalide de l\'API OpenAI:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI pour RIASEC:', error);
      
      // Informations détaillées sur l'erreur pour faciliter le débogage
      const errorDetails = {
        error: true,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        details: error.response?.data || 'Aucun détail disponible'
      };
      
      console.error('Détails de l\'erreur:', JSON.stringify(errorDetails, null, 2));
      
      return null;
    }
  }
}

module.exports = new OpenAIService(); 