const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const https = require('https');

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
 * Service pour interagir avec l'API Grok
 */
class GrokService {
  constructor() {
    // Configuration Grok
    this.apiUrl = process.env.GROK_API_URL || 'https://api.grok.ai/v1';
    this.apiKey = process.env.GROK_API_KEY;
    
    // Créer une instance axios avec des options https personnalisées pour résoudre les problèmes SSL
    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignorer les erreurs de certificat (à utiliser avec précaution)
        secureProtocol: 'TLSv1_2_method' // Forcer TLS 1.2
      }),
      timeout: 30000 // Augmenter le timeout à 30 secondes
    });
    
    // Log de débogage pour la configuration
    console.log('Service Grok initialisé:');
    console.log('- URL API:', this.apiUrl);
    console.log('- Clé API configurée:', this.apiKey ? 'Oui' : 'Non');
    
    if (!this.apiKey) {
      console.error('ATTENTION: Clé API Grok non configurée dans .env.local');
    }
  }

  /**
   * Analyse les réponses d'un test Big Five avec Grok
   * @param {Object} data - Les données du test (réponses, scores, etc.)
   * @returns {Promise<Object>} - L'analyse de Grok
   */
  async analyzeBigFiveResponses(data) {
    try {
      // Vérification de la clé API
      if (!this.apiKey) {
        console.error('Erreur: Clé API Grok non configurée dans les variables d\'environnement');
        return null;
      }

      console.log('Envoi de la requête à l\'API Grok pour analyse Big Five...');
      console.log('URL API utilisée:', this.apiUrl);
      
      // Essayer différentes URL si nécessaire
      const urls = [
        this.apiUrl,
        'https://api.x.ai/v1',
        'https://api.grok.x.ai/v1'
      ];
      
      let lastError = null;
      
      // Essayer chaque URL jusqu'à ce qu'une fonctionne
      for (const url of urls) {
        try {
          console.log(`Tentative avec l'URL: ${url}`);
          
          const response = await this.axiosInstance.post(
            `${url}/chat/completions`,
            {
              model: 'grok-2-latest',
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
            console.log('Réponse reçue de l\'API Grok');
            return {
              analysis: response.data.choices[0].message.content,
              model: response.data.model,
              usage: response.data.usage
            };
          } else {
            console.warn('Réponse invalide de l\'API Grok:', response.data);
          }
        } catch (error) {
          console.error(`Erreur avec l'URL ${url}:`, error.message);
          lastError = error;
          // Continuer avec l'URL suivante
        }
      }
      
      // Si toutes les URL ont échoué
      throw lastError || new Error('Toutes les tentatives ont échoué');
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Grok pour Big Five:', error);
      
      // Informations détaillées sur l'erreur pour faciliter le débogage
      const errorDetails = {
        error: true,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        details: error.response?.data || 'Aucun détail disponible'
      };
      
      console.error('Détails de l\'erreur:', JSON.stringify(errorDetails, null, 2));
      
      return errorDetails;
    }
  }
  
  /**
   * Analyse les réponses d'un test RIASEC avec Grok
   * @param {Object} data - Les données du test (réponses, scores, etc.)
   * @returns {Promise<Object>} - L'analyse de Grok
   */
  async analyzeRiasecResponses(data) {
    try {
      // Vérification de la clé API
      if (!this.apiKey) {
        console.error('Erreur: Clé API Grok non configurée dans les variables d\'environnement');
        return null;
      }

      console.log('Envoi de la requête à l\'API Grok pour analyse RIASEC...');
      
      const response = await this.axiosInstance.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'grok-2-latest',
          messages: [
            {
              role: 'system',
              content: 'Vous êtes un expert en analyse de tests psychométriques RIASEC. Analysez les résultats fournis et donnez des insights pertinents.'
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
        console.log('Réponse reçue de l\'API Grok');
        return {
          analysis: response.data.choices[0].message.content,
          model: response.data.model,
          usage: response.data.usage
        };
      } else {
        console.error('Réponse invalide de l\'API Grok:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Grok pour RIASEC:', error);
      
      // Informations détaillées sur l'erreur pour faciliter le débogage
      const errorDetails = {
        error: true,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        details: error.response?.data || 'Aucun détail disponible'
      };
      
      console.error('Détails de l\'erreur:', JSON.stringify(errorDetails, null, 2));
      
      return errorDetails;
    }
  }
}

module.exports = new GrokService();