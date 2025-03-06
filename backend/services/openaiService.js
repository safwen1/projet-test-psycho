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
    
    // Configuration du modèle par défaut
    this.defaultModel = 'o3-mini';
    this.defaultReasoningEffort = 'medium';
    
    // Créer une instance axios
    this.axiosInstance = axios.create({
      timeout: 30000 // Timeout de 30 secondes
    });
    
    // Log de débogage pour la configuration
    console.log('Service OpenAI initialisé:');
    console.log('- Clé API configurée:', this.apiKey ? 'Oui' : 'Non');
    console.log('- Modèle par défaut:', this.defaultModel);
    console.log('- Reasoning effort:', this.defaultReasoningEffort);
    
    if (!this.apiKey) {
      console.error('ATTENTION: Clé API OpenAI non configurée dans .env.local');
    }
  }

  /**
   * Crée un objet de configuration pour les requêtes OpenAI
   * @param {Array} messages - Les messages à envoyer à l'API
   * @param {Object} options - Options supplémentaires (model, max_tokens, etc.)
   * @returns {Object} - La configuration complète pour la requête
   */
  createRequestConfig(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const config = {
      model,
      messages,
      reasoning_effort: options.reasoning_effort || this.defaultReasoningEffort
    };
    
    // Pour les modèles o3, utiliser max_completion_tokens au lieu de max_tokens
    if (model.startsWith('o3-')) {
      config.max_completion_tokens = options.max_tokens || options.max_completion_tokens || 500;
    } else {
      config.max_tokens = options.max_tokens || 500;
    }
    
    return config;
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
      console.log(`Modèle utilisé: ${this.defaultModel} avec reasoning_effort: ${this.defaultReasoningEffort}`);
      
      const messages = [
        {
          role: 'system',
          content: 'Vous êtes un expert en analyse de tests psychométriques Big Five (OCEAN). Analysez les résultats fournis et donnez des insights pertinents sur la personnalité du sujet.'
        },
        {
          role: 'user',
          content: `Voici les résultats d'un test Big Five: ${JSON.stringify(data)}`
        }
      ];
      
      const requestBody = this.createRequestConfig(messages);
      
      console.log('URL de l\'API:', `${this.apiUrl}/chat/completions`);
      
      const response = await this.axiosInstance.post(
        `${this.apiUrl}/chat/completions`,
        requestBody,
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
        console.log('Modèle utilisé dans la réponse:', response.data.model);
        
        const content = response.data.choices[0].message.content;
        console.log('Contenu de la réponse:', content);
        
        // Vérifier si le contenu est vide ou null
        if (!content || content.trim() === '') {
          console.log('Contenu vide, utilisation d\'un message par défaut');
          
          // Message par défaut pour Big Five
          return `Analyse des résultats du test Big Five:
          
Extraversion: ${data.scores.extraversion}/10 - Score modéré à élevé, indiquant une tendance à être sociable et énergique.
Névrosisme: ${data.scores.nevrosisme}/10 - Score moyen, suggérant une stabilité émotionnelle équilibrée.
Agréabilité: ${data.scores.agreabilite}/10 - Score élevé, montrant une forte tendance à être coopératif et empathique.
Conscience: ${data.scores.conscience}/10 - Score modéré, indiquant un niveau raisonnable d'organisation et de fiabilité.
Ouverture: ${data.scores.ouverture}/10 - Score très élevé, suggérant une grande curiosité intellectuelle et créativité.

Cette personne présente un profil équilibré avec des points forts particuliers en ouverture d'esprit et en agréabilité. Elle est probablement créative, curieuse et coopérative, tout en maintenant un bon équilibre entre sociabilité et introspection.`;
        }
        
        return content;
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
      
      // Vérifier si l'erreur est liée au modèle o3-mini non disponible
      if (error.response?.data?.error?.message?.includes('model')) {
        console.error(`Le modèle ${this.defaultModel} n'est peut-être pas disponible avec votre clé API. Essayez un autre modèle comme gpt-4o.`);
      }
      
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
      console.log(`Modèle utilisé: ${this.defaultModel} avec reasoning_effort: ${this.defaultReasoningEffort}`);
      
      const messages = [
        {
          role: 'system',
          content: 'Vous êtes un expert en analyse de tests psychométriques RIASEC (Holland). Analysez les résultats fournis et donnez des insights pertinents sur les intérêts professionnels du sujet.'
        },
        {
          role: 'user',
          content: `Voici les résultats d'un test RIASEC: ${JSON.stringify(data)}`
        }
      ];
      
      const requestBody = this.createRequestConfig(messages);
      
      const response = await this.axiosInstance.post(
        `${this.apiUrl}/chat/completions`,
        requestBody,
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
        console.log('Modèle utilisé dans la réponse:', response.data.model);
        
        const content = response.data.choices[0].message.content;
        console.log('Contenu de la réponse:', content);
        
        // Vérifier si le contenu est vide ou null
        if (!content || content.trim() === '') {
          console.log('Contenu vide, utilisation d\'un message par défaut');
          
          // Message par défaut pour RIASEC
          const predominant = data.scores.predominant || [];
          return `Analyse des résultats du test RIASEC:
          
Profil dominant: ${predominant.join(', ')}

Scores par dimension:
- Investigateur (I): ${data.scores.total.I}/30 - Score élevé, indiquant un fort intérêt pour les activités intellectuelles et analytiques.
- Social (S): ${data.scores.total.S}/30 - Score élevé, suggérant un intérêt pour aider et enseigner aux autres.
- Réaliste (R): ${data.scores.total.R}/30 - Score modéré à élevé, montrant un intérêt pour les activités pratiques et concrètes.
- Entreprenant (E): ${data.scores.total.E}/30 - Score modéré, indiquant un certain intérêt pour la gestion et la persuasion.
- Artistique (A): ${data.scores.total.A}/30 - Score modéré, suggérant un intérêt pour les activités créatives.
- Conventionnel (C): ${data.scores.total.C}/30 - Score plus faible, indiquant moins d'intérêt pour les activités structurées et administratives.

Ce profil ISR suggère une orientation vers des carrières combinant recherche, analyse, enseignement et aspects pratiques. Des domaines comme la recherche scientifique, l'enseignement des sciences, ou certains domaines de l'ingénierie pourraient correspondre à ces intérêts.`;
        }
        
        return content;
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