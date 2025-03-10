import axios from 'axios';
import errorToastAdapter from './errorToast.jsx';

// Configuration de l'URL de base pour les appels API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Création d'une instance axios avec une configuration par défaut
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Liste des messages d'erreur par code d'erreur
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Les données fournies ne sont pas valides.',
  AUTHENTICATION_ERROR: 'Vous devez être connecté pour accéder à cette ressource.',
  AUTHORIZATION_ERROR: 'Vous n\'avez pas les droits nécessaires pour effectuer cette action.',
  NOT_FOUND_ERROR: 'La ressource demandée n\'existe pas.',
  EXTERNAL_SERVICE_ERROR: 'Un service externe a rencontré un problème.',
  INTERNAL_SERVER_ERROR: 'Une erreur interne est survenue sur le serveur.',
  NETWORK_ERROR: 'Impossible de communiquer avec le serveur. Vérifiez votre connexion internet.',
  TIMEOUT_ERROR: 'Le serveur a mis trop de temps à répondre.',
  DEFAULT: 'Une erreur inattendue s\'est produite.',
};

// Fonction pour obtenir un message d'erreur utilisateur convivial
const getReadableErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.DEFAULT;
  
  // Si c'est une erreur réseau
  if (error.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  // Si c'est un timeout
  if (error.code === 'ECONNABORTED') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }
  
  // Si le serveur a renvoyé une réponse structurée
  if (error.response?.data?.error?.code) {
    const errorCode = error.response.data.error.code;
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.DEFAULT;
  }
  
  // Fallback pour les erreurs HTTP génériques
  if (error.response?.status) {
    switch (true) {
      case error.response.status >= 400 && error.response.status < 500:
        return 'Une erreur est survenue dans votre requête.';
      case error.response.status >= 500:
        return 'Le serveur a rencontré une erreur technique.';
      default:
        return ERROR_MESSAGES.DEFAULT;
    }
  }
  
  return ERROR_MESSAGES.DEFAULT;
};

// Gestionnaire d'erreur qui format l'erreur de manière cohérente
const handleApiError = (error, showToast = false) => {
  const readableMessage = getReadableErrorMessage(error);
  
  // Structure d'erreur normalisée
  const formattedError = {
    message: readableMessage,
    originalError: error,
    details: error.response?.data?.error?.details || null,
    status: error.response?.status || 0,
    code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
  };
  
  // Log en développement
  if (import.meta.env.DEV) {
    console.error('Erreur API:', formattedError);
  }
  
  // Afficher le toast si demandé
  if (showToast) {
    errorToastAdapter.critical(formattedError);
  }
  
  return formattedError;
};

// Configuration par défaut des méthodes API
const defaultOptions = {
  // Afficher automatiquement les toasts en cas d'erreur
  showErrorToast: false
};

// Méthode de requête GET simplifiée avec gestion d'erreur
const get = async (endpoint, params = {}, options = {}) => {
  const { showErrorToast } = { ...defaultOptions, ...options };
  
  try {
    const response = await apiClient.get(endpoint, { params });
    return { success: true, data: response.data };
  } catch (error) {
    const formattedError = handleApiError(error, showErrorToast);
    return { success: false, error: formattedError };
  }
};

// Méthode de requête POST simplifiée avec gestion d'erreur
const post = async (endpoint, data = {}, options = {}) => {
  const { showErrorToast } = { ...defaultOptions, ...options };
  
  try {
    const response = await apiClient.post(endpoint, data);
    return { success: true, data: response.data };
  } catch (error) {
    const formattedError = handleApiError(error, showErrorToast);
    return { success: false, error: formattedError };
  }
};

// Méthode de requête PUT simplifiée avec gestion d'erreur
const put = async (endpoint, data = {}, options = {}) => {
  const { showErrorToast } = { ...defaultOptions, ...options };
  
  try {
    const response = await apiClient.put(endpoint, data);
    return { success: true, data: response.data };
  } catch (error) {
    const formattedError = handleApiError(error, showErrorToast);
    return { success: false, error: formattedError };
  }
};

// Méthode de requête DELETE simplifiée avec gestion d'erreur
const del = async (endpoint, options = {}) => {
  const { showErrorToast } = { ...defaultOptions, ...options };
  
  try {
    const response = await apiClient.delete(endpoint);
    return { success: true, data: response.data };
  } catch (error) {
    const formattedError = handleApiError(error, showErrorToast);
    return { success: false, error: formattedError };
  }
};

// Exportation des méthodes
export default {
  get,
  post,
  put,
  delete: del,
  client: apiClient,
  handleApiError,
  getReadableErrorMessage
}; 