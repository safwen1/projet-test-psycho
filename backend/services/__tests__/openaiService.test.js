const axios = require('axios');
const openaiService = require('../openaiService');

// Mock axios pour éviter les appels API réels pendant les tests
jest.mock('axios');

describe('OpenAI Service', () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurer le mock pour l'instance axios du service
    openaiService.axiosInstance = {
      post: jest.fn()
    };
  });

  describe('analyzeBigFiveResponses', () => {
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

    test('devrait retourner l\'analyse quand l\'API répond avec succès', async () => {
      // Configurer le mock pour simuler une réponse réussie
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Analyse du Big Five: Le sujet présente un profil équilibré...'
              }
            }
          ],
          model: 'gpt-4o',
          usage: { total_tokens: 500 }
        }
      };
      
      openaiService.axiosInstance.post.mockResolvedValue(mockResponse);

      // Exécuter la fonction à tester
      const result = await openaiService.analyzeBigFiveResponses(testData);

      // Vérifier que le résultat est correct
      expect(result).toBe('Analyse du Big Five: Le sujet présente un profil équilibré...');
      
      // Vérifier que l'appel à l'API a été fait avec les bons paramètres
      expect(openaiService.axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          model: 'gpt-4o',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user' })
          ])
        }),
        expect.any(Object)
      );
    });

    test('devrait retourner null quand la clé API n\'est pas configurée', async () => {
      // Sauvegarder la clé API originale
      const originalApiKey = openaiService.apiKey;
      
      // Supprimer la clé API pour le test
      openaiService.apiKey = null;
      
      // Exécuter la fonction à tester
      const result = await openaiService.analyzeBigFiveResponses(testData);
      
      // Vérifier que le résultat est null
      expect(result).toBeNull();
      
      // Restaurer la clé API originale
      openaiService.apiKey = originalApiKey;
    });

    test('devrait retourner null quand l\'API répond avec une structure invalide', async () => {
      // Configurer le mock pour simuler une réponse invalide
      const mockResponse = {
        data: {
          // Pas de choices ou choices vide
        }
      };
      
      openaiService.axiosInstance.post.mockResolvedValue(mockResponse);

      // Exécuter la fonction à tester
      const result = await openaiService.analyzeBigFiveResponses(testData);

      // Vérifier que le résultat est null
      expect(result).toBeNull();
    });

    test('devrait gérer les erreurs de l\'API correctement', async () => {
      // Configurer le mock pour simuler une erreur
      const mockError = new Error('API Error');
      mockError.response = { status: 500, data: { error: 'Internal Server Error' } };
      
      openaiService.axiosInstance.post.mockRejectedValue(mockError);

      // Exécuter la fonction à tester
      const result = await openaiService.analyzeBigFiveResponses(testData);

      // Vérifier que le résultat est null
      expect(result).toBeNull();
    });
  });

  describe('analyzeRiasecResponses', () => {
    const testData = {
      scores: {
        total: {
          R: 15,
          I: 22,
          A: 18,
          S: 25,
          E: 20,
          C: 12
        },
        predominant: ['S', 'I', 'E'],
        themes: {
          R: 'Réaliste',
          I: 'Investigateur',
          A: 'Artistique',
          S: 'Social',
          E: 'Entreprenant',
          C: 'Conventionnel'
        }
      },
      responses: {
        q1: 3,
        q2: 4,
        q3: 2,
        q4: 5,
        q5: 3
      }
    };

    test('devrait retourner l\'analyse quand l\'API répond avec succès', async () => {
      // Configurer le mock pour simuler une réponse réussie
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Analyse RIASEC: Le profil dominant est Social-Investigateur-Entreprenant...'
              }
            }
          ],
          model: 'gpt-4o',
          usage: { total_tokens: 500 }
        }
      };
      
      openaiService.axiosInstance.post.mockResolvedValue(mockResponse);

      // Exécuter la fonction à tester
      const result = await openaiService.analyzeRiasecResponses(testData);

      // Vérifier que le résultat est correct
      expect(result).toBe('Analyse RIASEC: Le profil dominant est Social-Investigateur-Entreprenant...');
      
      // Vérifier que l'appel à l'API a été fait avec les bons paramètres
      expect(openaiService.axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          model: 'gpt-4o',
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user' })
          ])
        }),
        expect.any(Object)
      );
    });

    // Les autres tests pour analyzeRiasecResponses seraient similaires à ceux de analyzeBigFiveResponses
  });
}); 