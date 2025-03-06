import { toast } from 'react-toastify'; // Remplacez par votre bibliothèque de toast si différente

// Types d'erreurs pour les styles des toasts
export const ErrorTypes = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * Configuration de base des toasts
 * Ajustez selon vos préférences ou selon la bibliothèque de toast que vous utilisez
 */
const toastConfig = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

/**
 * Fonction qui affiche un message d'erreur via Toaster
 * @param {Object|string} error - L'erreur à afficher
 * @param {string} type - Le type d'erreur (critical, warning, info)
 * @param {Object} options - Options supplémentaires pour le toast
 */
export const showErrorToast = (error, type = ErrorTypes.CRITICAL, options = {}) => {
  // Extraction du message d'erreur
  const message = typeof error === 'string' 
    ? error 
    : error.message || 'Une erreur est survenue';
  
  // Extraction des détails si disponibles
  const details = typeof error !== 'string' && error.details 
    ? error.details 
    : null;
  
  // Création du contenu du toast
  const content = (
    <div>
      <div className="font-medium">{message}</div>
      {details && (
        <div className="mt-1 text-sm opacity-90">
          {typeof details === 'string' 
            ? details 
            : JSON.stringify(details, null, 2)}
        </div>
      )}
    </div>
  );
  
  // Configuration du toast selon le type d'erreur
  const toastOptions = {
    ...toastConfig,
    ...options
  };
  
  // Choix de la méthode toast selon le type d'erreur
  switch (type) {
    case ErrorTypes.WARNING:
      toast.warning(content, toastOptions);
      break;
    case ErrorTypes.INFO:
      toast.info(content, toastOptions);
      break;
    case ErrorTypes.CRITICAL:
    default:
      toast.error(content, toastOptions);
      break;
  }
  
  // Pour le débogage en développement
  if (import.meta.env.DEV) {
    console.error('Erreur affichée via toast:', error);
  }
  
  return error; // Pour permettre le chaînage
};

/**
 * Adaptateur pour utiliser notre système d'erreur avec Toaster
 */
const errorToastAdapter = {
  // Afficher une erreur critique
  critical: (error, options = {}) => showErrorToast(error, ErrorTypes.CRITICAL, options),
  
  // Afficher un avertissement
  warning: (error, options = {}) => showErrorToast(error, ErrorTypes.WARNING, options),
  
  // Afficher une information
  info: (error, options = {}) => showErrorToast(error, ErrorTypes.INFO, options),
  
  // Traiter une erreur API et l'afficher avec Toaster
  handleApiError: (error, type = ErrorTypes.CRITICAL, options = {}) => {
    showErrorToast(error, type, options);
    return error; // Pour permettre le chaînage
  }
};

export default errorToastAdapter; 