import React, { useState } from 'react';
import api from '../utils/api';
import useError from '../hooks/useError';
import { ErrorTypes } from '../utils/errorToast.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Composant d'exemple qui illustre l'utilisation du système de gestion d'erreur avec Toaster
 */
const ToastErrorExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Utilisation du hook de gestion d'erreur avec toasts
  const { 
    executeWithErrorHandling,
    showCriticalToast,
    showWarningToast,
    showInfoToast
  } = useError({
    // Configurer les options des toasts si nécessaire
    toastOptions: {
      autoClose: 5000
    }
  });
  
  // Fonction qui effectue un appel API avec affichage automatique des toasts
  const handleFetchWithToast = async () => {
    setIsLoading(true);
    
    // Appel API avec affichage automatique des toasts en cas d'erreur
    const response = await api.get('/personality-test/results', {}, { showErrorToast: true });
    
    if (response.success) {
      setData(response.data);
    }
    
    setIsLoading(false);
    return response;
  };
  
  // Fonction qui utilise executeWithErrorHandling
  const handleFetchWithErrorHandling = async () => {
    setIsLoading(true);
    
    await executeWithErrorHandling(async () => {
      const response = await api.get('/personality-test/results');
      
      if (response.success) {
        setData(response.data);
        return response;
      } else {
        // Si erreur, on la lance pour qu'elle soit traitée par executeWithErrorHandling
        throw response.error;
      }
    });
    
    setIsLoading(false);
  };
  
  // Exemples de simulation d'erreurs
  const simulateValidationError = () => {
    showCriticalToast({
      message: 'Les données fournies ne sont pas valides',
      details: {
        fields: {
          email: 'Format d\'email invalide',
          age: 'L\'âge doit être un nombre positif'
        }
      }
    });
  };
  
  const simulateNetworkError = () => {
    showCriticalToast({
      message: 'Impossible de communiquer avec le serveur',
      code: 'NETWORK_ERROR'
    });
  };
  
  const simulateWarning = () => {
    showWarningToast({
      message: 'Certaines données sont manquantes',
      details: 'Les champs optionnels n\'ont pas été remplis'
    });
  };
  
  const simulateInfo = () => {
    showInfoToast('Votre session va expirer dans 5 minutes');
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Exemple de gestion d'erreur avec Toaster</h2>
      
      {/* Boutons pour tester les appels API */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleFetchWithToast}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'API avec toast auto'}
        </button>
        
        <button
          onClick={handleFetchWithErrorHandling}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'API avec error handling'}
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
          
          <button
            onClick={simulateInfo}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
          >
            Information
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
      
      {/* Conteneur des toasts - Important de l'inclure une fois dans votre app */}
      <ToastContainer />
    </div>
  );
};

export default ToastErrorExample; 