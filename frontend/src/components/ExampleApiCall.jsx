import React, { useState } from 'react';
import api from '../utils/api';
import useError from '../hooks/useError';
import { ErrorDisplay, ErrorTypes } from './ErrorDisplay';

/**
 * Composant d'exemple qui illustre l'utilisation du système de gestion d'erreur
 */
const ExampleApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Utilisation du hook de gestion d'erreur
  const { 
    error, 
    errorType, 
    clearError, 
    handleApiError,
    executeWithErrorHandling
  } = useError();
  
  // Fonction qui effectue un appel API avec gestion d'erreur manuelle
  const handleManualFetch = async () => {
    try {
      setIsLoading(true);
      clearError(); // Effacer les erreurs précédentes
      
      // Appel API avec notre utilitaire
      const response = await api.get('/personality-test/results');
      
      // Vérification du succès de la réponse
      if (response.success) {
        setData(response.data);
      } else {
        // Gestion explicite de l'erreur
        handleApiError(response.error);
      }
    } catch (err) {
      // Capture des erreurs imprévues
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction qui effectue un appel API avec gestion d'erreur automatique
  const handleAutomaticFetch = async () => {
    setIsLoading(true);
    
    // Utilisation de executeWithErrorHandling qui gère les try/catch automatiquement
    const result = await executeWithErrorHandling(async () => {
      const response = await api.get('/personality-test/results');
      
      if (response.success) {
        setData(response.data);
        return response;
      }
      
      // Si la réponse n'est pas réussie, on lance une erreur
      throw response.error;
    });
    
    setIsLoading(false);
    return result;
  };
  
  // Exemple de simulation d'erreurs de différents types
  const simulateValidationError = () => {
    executeWithErrorHandling(() => {
      throw {
        message: 'Les données fournies ne sont pas valides',
        code: 'VALIDATION_ERROR',
        details: {
          fields: {
            email: 'Format d\'email invalide',
            age: 'L\'âge doit être un nombre positif'
          }
        }
      };
    });
  };
  
  const simulateNetworkError = () => {
    executeWithErrorHandling(() => {
      throw {
        message: 'Network Error',
        code: 'NETWORK_ERROR'
      };
    });
  };
  
  const simulateWarning = () => {
    executeWithErrorHandling(() => {
      throw {
        message: 'Certaines données sont manquantes mais non obligatoires',
        details: 'Les champs optionnels n\'ont pas été remplis'
      };
    }, ErrorTypes.WARNING);
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Exemple de gestion d'erreur</h2>
      
      {/* Affichage des erreurs */}
      {error && (
        <ErrorDisplay 
          error={error}
          type={errorType}
          showDetails={true}
          onRetry={handleManualFetch}
          onDismiss={clearError}
        />
      )}
      
      {/* Boutons pour tester les appels API */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleManualFetch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'Appel API (manuel)'}
        </button>
        
        <button
          onClick={handleAutomaticFetch}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'Appel API (auto)'}
        </button>
      </div>
      
      {/* Boutons pour simuler des erreurs */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Simuler des erreurs:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={simulateValidationError}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Erreur de validation
          </button>
          
          <button
            onClick={simulateNetworkError}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Erreur réseau
          </button>
          
          <button
            onClick={simulateWarning}
            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200"
          >
            Avertissement
          </button>
        </div>
      </div>
      
      {/* Affichage des données (si disponibles) */}
      {data && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium mb-2">Données reçues:</h3>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ExampleApiCall; 