import { useState, useCallback } from 'react';
import errorToastAdapter, { ErrorTypes } from '../utils/errorToast.jsx';

/**
 * Hook personnalisé pour gérer les erreurs dans les composants React avec Toaster
 * 
 * @param {Object} options Options de configuration
 * @param {Function} options.onError Callback exécuté quand une erreur est définie
 * @param {boolean} options.showToast Afficher automatiquement les erreurs via toast (défaut: true)
 * @param {Object} options.toastOptions Options supplémentaires pour les toasts
 * @returns {Object} Méthodes et état pour gérer les erreurs
 */
const useError = (options = {}) => {
  const { 
    onError, 
    showToast = true,
    toastOptions = {}
  } = options;
  
  // État pour stocker l'erreur courante
  const [error, setError] = useState(null);
  
  // État pour stocker le type d'erreur (critique, avertissement, info)
  const [errorType, setErrorType] = useState(ErrorTypes.CRITICAL);
  
  // Fonction pour définir une erreur avec un type spécifique
  const setErrorWithType = useCallback((newError, type = ErrorTypes.CRITICAL) => {
    if (newError) {
      // Mettre à jour l'état local
      setError(newError);
      setErrorType(type);
      
      // Afficher le toast si l'option est activée
      if (showToast) {
        errorToastAdapter.handleApiError(newError, type, toastOptions);
      }
      
      // Appeler le callback onError si défini
      if (onError && typeof onError === 'function') {
        onError(newError, type);
      }
      
      // Log en développement
      if (import.meta.env.DEV) {
        console.error('Erreur capturée:', 
          typeof newError === 'string' ? newError : newError.message || newError);
      }
    }
  }, [onError, showToast, toastOptions]);
  
  // Fonctions de raccourci pour définir différents types d'erreurs
  const setCriticalError = useCallback((error) => {
    setErrorWithType(error, ErrorTypes.CRITICAL);
  }, [setErrorWithType]);
  
  const setWarning = useCallback((warning) => {
    setErrorWithType(warning, ErrorTypes.WARNING);
  }, [setErrorWithType]);
  
  const setInfo = useCallback((info) => {
    setErrorWithType(info, ErrorTypes.INFO);
  }, [setErrorWithType]);
  
  // Fonction pour effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Gestionnaire d'erreur pour les promesses rejetées (catch)
  const handleApiError = useCallback((error) => {
    setErrorWithType(error, ErrorTypes.CRITICAL);
    return error; // Permet le chaînage
  }, [setErrorWithType]);
  
  // Fonction utilitaire pour exécuter une fonction avec gestion d'erreur
  const executeWithErrorHandling = useCallback(async (fn, errorType = ErrorTypes.CRITICAL) => {
    try {
      clearError();
      return await fn();
    } catch (error) {
      setErrorWithType(error, errorType);
      return { success: false, error };
    }
  }, [clearError, setErrorWithType]);
  
  // Raccourcis directs vers les fonctions toast
  const showCriticalToast = useCallback((error, options = {}) => {
    return errorToastAdapter.critical(error, { ...toastOptions, ...options });
  }, [toastOptions]);
  
  const showWarningToast = useCallback((warning, options = {}) => {
    return errorToastAdapter.warning(warning, { ...toastOptions, ...options });
  }, [toastOptions]);
  
  const showInfoToast = useCallback((info, options = {}) => {
    return errorToastAdapter.info(info, { ...toastOptions, ...options });
  }, [toastOptions]);
  
  return {
    // État
    error,
    errorType,
    hasError: !!error,
    
    // Fonctions pour modifier l'état interne
    setError: setErrorWithType,
    setCriticalError,
    setWarning,
    setInfo,
    clearError,
    
    // Fonctions pour gérer les erreurs d'API
    handleApiError,
    executeWithErrorHandling,
    
    // Fonctions pour afficher directement des toasts sans changer l'état
    showCriticalToast,
    showWarningToast,
    showInfoToast
  };
};

export default useError; 