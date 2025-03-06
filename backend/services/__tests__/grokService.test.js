const axios = require('axios');
const grokService = require('../grokService');

// Mock axios pour éviter les appels API réels pendant les tests
jest.mock('axios');

describe('Grok Service', () => {
  // Réinitialiser les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurer le mock pour l'instance axios du service
    grokService.axiosInstance = {
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
                content: 'Analyse du Big Five par Grok: Le sujet présente un profil équilibré...'
              }
            }
          ],
          model: 'grok-2-latest',
          usage: { total_tokens: 500 }
        }
      };
      
      grokService.axiosInstance.post.mockResolvedValue(mockResponse);

      // Exécuter la fonction à tester
      const result = await grokService.analyzeBigFiveResponses(testData);

      // Vérifier que le résultat est correct
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toBe('Analyse du Big Five par Grok: Le sujet présente un profil équilibré...');
      expect(result).toHaveProperty('model', 'grok-2-latest');
      expect(result).toHaveProperty('usage');
      
      // Vérifier que l'appel à l'API a été fait avec les bons paramètres
      expect(grokService.axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          model: 'grok-2-latest',
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
      const originalApiKey = grokService.apiKey;
      
      // Supprimer la clé API pour le test
      grokService.apiKey = null;
      
      // Exécuter la fonction à tester
      const result = await grokService.analyzeBigFiveResponses(testData);
      
      // Vérifier que le résultat est null
      expect(result).toBeNull();
      
      // Restaurer la clé API originale
      grokService.apiKey = originalApiKey;
    });

    test('devrait essayer plusieurs URLs en cas d\'échec', async () => {
      // Configurer le mock pour simuler un échec sur la première URL et un succès sur la deuxième
      const mockError = new Error('API Error');
      mockError.response = { status: 500, data: { error: 'Internal Server Error' } };
      
      const mockSuccess = {
        data: {
          choices: [
            {
              message: {
                content: 'Analyse du Big Five par Grok: Le sujet présente un profil équilibré...'
              }
            }
          ],
          model: 'grok-2-latest',
          usage: { total_tokens: 500 }
        }
      };
      
      // Configurer le mock pour échouer puis réussir
      grokService.axiosInstance.post
        .mockRejectedValueOnce(mockError)  // Premier appel échoue
        .mockResolvedValueOnce(mockSuccess);  // Deuxième appel réussit

      // Exécuter la fonction à tester
      const result = await grokService.analyzeBigFiveResponses(testData);

      // Vérifier que le résultat est correct
      expect(result).toHaveProperty('analysis');
      
      // Vérifier que l'API a été appelée deux fois (avec des URLs différentes)
      expect(grokService.axiosInstance.post).toHaveBeenCalledTimes(2);
    });

    test('devrait retourner une erreur si toutes les URLs échouent', async () => {
      // Configurer le mock pour simuler un échec sur toutes les URLs
      const mockError = new Error('API Error');
      mockError.response = { status: 500, data: { error: 'Internal Server Error' } };
      
      grokService.axiosInstance.post.mockRejectedValue(mockError);

      // Exécuter la fonction à tester
      const result = await grokService.analyzeBigFiveResponses(testData);

      // Vérifier que le résultat contient une erreur
      expect(result).toHaveProperty('error', true);
      expect(result).toHaveProperty('message');
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
                content: 'Analyse RIASEC par Grok: Le profil dominant est Social-Investigateur-Entreprenant...'
              }
            }
          ],
          model: 'grok-2-latest',
          usage: { total_tokens: 500 }
        }
      };
      
      grokService.axiosInstance.post.mockResolvedValue(mockResponse);

      // Exécuter la fonction à tester
      const result = await grokService.analyzeRiasecResponses(testData);

      // Vérifier que le résultat est correct
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toBe('Analyse RIASEC par Grok: Le profil dominant est Social-Investigateur-Entreprenant...');
      
      // Vérifier que l'appel à l'API a été fait avec les bons paramètres
      expect(grokService.axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          model: 'grok-2-latest',
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