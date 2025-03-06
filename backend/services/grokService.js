const axios = require('axios');

/**
 * Service pour interagir avec l'API Grok3
 */
class GrokService {
  constructor() {
    this.apiUrl = process.env.GROK_API_URL || 'https://api.grok.ai/v1';
    this.apiKey = process.env.GROK_API_KEY;
  }

  /**
   * Analyse les réponses d'un test RIASEC avec Grok3
   * @param {Object} data - Les données du test (réponses, scores, etc.)
   * @returns {Promise<Object>} - L'analyse de Grok3
   */
  async analyzeRiasecResponses(data) {
    try {
      if (!this.apiKey) {
        throw new Error('Clé API Grok non configurée');
      }

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'grok-3',
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

      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Grok3:', error);
      return {
        error: true,
        message: error.message,
        details: error.response?.data || 'Aucun détail disponible'
      };
    }
  }

  /**
   * Analyse les réponses d'un test Big Five avec Grok3
   * @param {Object} data - Les données du test (réponses, scores, etc.)
   * @returns {Promise<Object>} - L'analyse de Grok3
   */
  async analyzeBigFiveResponses(data) {
    try {
      if (!this.apiKey) {
        throw new Error('Clé API Grok non configurée');
      }

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'grok-3',
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

      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Grok3 pour Big Five:', error);
      return {
        error: true,
        message: error.message,
        details: error.response?.data || 'Aucun détail disponible'
      };
    }
  }
}

module.exports = new GrokService(); 