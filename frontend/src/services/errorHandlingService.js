/**
 * Service de gestion d'erreurs avancé
 * Permet de capturer, analyser et traiter les erreurs de l'application
 * avec un focus particulier sur la compatibilité des navigateurs
 */

import { detectBrowser, createBrowserCompatibilityReport } from './browserDetectionService';
import { toast } from 'react-toastify';

// Liste des erreurs connues liées à des problèmes de compatibilité
const KNOWN_COMPATIBILITY_ERRORS = {
  WEBGL_NOT_SUPPORTED: {
    patterns: [
      'WebGL is not supported',
      'Unable to get WebGL context',
      'WebGL context creation failed',
      'WebGL not supported by this browser',
    ],
    browsers: ['ie', 'old safari', 'old android browser'],
    featureRequired: 'webgl',
    solution: 'Utilisez un navigateur récent comme Chrome, Firefox, Edge ou Safari.',
  },
  LOCALSTORAGE_BLOCKED: {
    patterns: [
      'localStorage is not defined',
      'localStorage is not available',
      'Failed to read localStorage',
      'Access is denied for localStorage',
      'SecurityError',
    ],
    browsers: ['safari (private mode)', 'firefox (private mode)'],
    featureRequired: 'localstorage',
    solution: 'Désactivez le mode navigation privée ou autorisez le stockage local dans vos paramètres de confidentialité.',
  },
  PROMISE_NOT_SUPPORTED: {
    patterns: [
      'Promise is not defined',
      'Promise is not a constructor',
    ],
    browsers: ['ie', 'old android browser'],
    featureRequired: 'promiseAll',
    solution: 'Mettez à jour votre navigateur ou utilisez Chrome, Firefox, Edge ou Safari.',
  },
  FETCH_NOT_SUPPORTED: {
    patterns: [
      'fetch is not defined',
      'fetch is not a function',
    ],
    browsers: ['ie', 'old android browser'],
    featureRequired: 'fetch',
    solution: 'Mettez à jour votre navigateur ou utilisez Chrome, Firefox, Edge ou Safari.',
  },
  ASYNC_AWAIT_NOT_SUPPORTED: {
    patterns: [
      'async is not defined',
      'await is not defined',
      'Unexpected token function',
      'Unexpected identifier',
    ],
    browsers: ['ie', 'old android browser', 'old safari'],
    featureRequired: 'asyncAwait',
    solution: 'Mettez à jour votre navigateur ou utilisez Chrome, Firefox, Edge ou Safari.',
  },
  FLEX_NOT_SUPPORTED: {
    patterns: [
      'display: flex',
      'flexbox',
      'flex-direction',
    ],
    browsers: ['ie'],
    featureRequired: 'flexbox',
    solution: 'Mettez à jour votre navigateur ou utilisez Chrome, Firefox, Edge ou Safari.',
  },
  TOUCH_EVENTS_ISSUE: {
    patterns: [
      'TouchEvent',
      'ontouchstart',
      'touchmove',
      'touchend',
    ],
    browsers: ['desktop browsers'],
    featureRequired: 'touchscreen',
    solution: 'Cette fonctionnalité est optimisée pour les appareils tactiles. Utilisez un appareil mobile ou une tablette.',
  },
  PERFORMANCE_ISSUE: {
    patterns: [
      'script timeout',
      'took too long to respond',
      'exceeded the time limit',
    ],
    browsers: ['old android browser', 'old mobile browsers'],
    solution: 'Votre appareil semble avoir des difficultés à exécuter cette application. Essayez avec un appareil plus récent ou un navigateur plus performant.',
  },
};

/**
 * Analyse une erreur pour déterminer si elle est liée à un problème de compatibilité
 * @param {Error} error - L'erreur à analyser
 * @returns {Object|null} Informations sur l'erreur de compatibilité ou null
 */
export const analyzeError = (error) => {
  const errorMessage = error.message || error.toString();
  const errorStack = error.stack || '';
  const combinedErrorText = `${errorMessage} ${errorStack}`.toLowerCase();

  // Vérifier si l'erreur correspond à une erreur connue
  for (const [errorType, errorInfo] of Object.entries(KNOWN_COMPATIBILITY_ERRORS)) {
    const isMatch = errorInfo.patterns.some(pattern => 
      combinedErrorText.includes(pattern.toLowerCase())
    );

    if (isMatch) {
      const browserInfo = detectBrowser();
      return {
        type: errorType,
        message: errorMessage,
        stack: errorStack,
        browserInfo,
        ...errorInfo,
        isCompatibilityIssue: true,
      };
    }
  }

  // Si ce n'est pas une erreur connue, faire une analyse plus générale
  const browserReport = createBrowserCompatibilityReport();
  if (!browserReport.essentialFeaturesSupported) {
    return {
      type: 'GENERAL_COMPATIBILITY_ISSUE',
      message: errorMessage,
      stack: errorStack,
      browserInfo: browserReport.browserInfo,
      isCompatibilityIssue: true,
      featuresMissing: Object.entries(browserReport.supportedFeatures)
        .filter(([_, supported]) => !supported)
        .map(([feature]) => feature),
      solution: 'Votre navigateur ne prend pas en charge certaines fonctionnalités essentielles. Veuillez utiliser un navigateur plus récent comme Chrome, Firefox, Edge ou Safari.',
    };
  }

  // Si ce n'est pas un problème de compatibilité
  return null;
};

/**
 * Gère une erreur et affiche un message approprié à l'utilisateur
 * @param {Error} error - L'erreur à gérer
 * @param {Object} options - Options supplémentaires
 * @returns {Object} Informations sur la gestion de l'erreur
 */
export const handleError = (error, options = {}) => {
  const { silent = false, context = null, throwError = false } = options;
  
  // Enregistrer l'erreur dans la console
  console.error('[ErrorHandler]', error, context ? { context } : '');

  // Analyser l'erreur pour déterminer si c'est un problème de compatibilité
  const compatibilityIssue = analyzeError(error);
  
  if (compatibilityIssue) {
    // C'est un problème de compatibilité
    const { type, solution, browserInfo } = compatibilityIssue;
    
    // Message adapté à l'utilisateur
    const userMessage = `Problème de compatibilité détecté sur ${browserInfo.browser} (${browserInfo.os}): ${solution}`;
    
    if (!silent) {
      // Afficher une notification avec toast
      toast.error(userMessage, {
        position: "top-center",
        autoClose: 7000, // Plus long pour que l'utilisateur ait le temps de lire
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    // Enregistrer l'incident pour analyse
    console.warn(`[BrowserCompatibility] ${type} détecté sur ${browserInfo.browser} (${browserInfo.os})`);
    
    return {
      handled: true,
      isCompatibilityIssue: true,
      userMessage,
      details: compatibilityIssue,
    };
  } else {
    // Erreur standard (non liée à la compatibilité)
    const userMessage = "Une erreur s'est produite. Veuillez réessayer ou contacter l'assistance.";
    
    if (!silent) {
      toast.error(userMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
    
    if (throwError) {
      throw error;
    }
    
    return {
      handled: true,
      isCompatibilityIssue: false,
      userMessage,
      originalError: error,
    };
  }
};

/**
 * Crée un wrapper de fonction sécurisé qui capture les erreurs
 * @param {Function} fn - La fonction à exécuter en toute sécurité
 * @param {Object} options - Options de gestion d'erreur
 * @returns {Function} Fonction sécurisée qui ne plantera pas
 */
export const safeFn = (fn, options = {}) => {
  return (...args) => {
    try {
      const result = fn(...args);
      
      // Si le résultat est une promesse, gérer les erreurs asynchrones
      if (result instanceof Promise) {
        return result.catch(error => {
          handleError(error, options);
          
          // Si fallbackValue est défini, renvoyer cette valeur en cas d'erreur
          if ('fallbackValue' in options) {
            return options.fallbackValue;
          }
          
          // Sinon, propager l'erreur
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      handleError(error, options);
      
      // Si fallbackValue est défini, renvoyer cette valeur en cas d'erreur
      if ('fallbackValue' in options) {
        return options.fallbackValue;
      }
      
      // Sinon, propager l'erreur
      throw error;
    }
  };
};

/**
 * HOC (Higher Order Component) pour sécuriser les composants React
 * @param {React.Component} Component - Le composant à sécuriser
 * @param {Object} options - Options de gestion d'erreur
 * @returns {React.Component} Composant sécurisé avec gestion d'erreur
 */
export const withErrorHandling = (Component, options = {}) => {
  // L'implémentation complète nécessiterait React
  // Ceci est une esquisse qui sera à adapter selon l'utilisation

  return function SafeComponent(props) {
    try {
      return Component(props);
    } catch (error) {
      handleError(error, options);
      
      // Retourner un composant de fallback ou null
      return options.fallbackUI || null;
    }
  };
};

/**
 * Initialise le gestionnaire global d'erreurs pour capturer les erreurs non gérées
 */
export const initGlobalErrorHandler = () => {
  // Capturer les erreurs non gérées au niveau window
  window.addEventListener('error', (event) => {
    handleError(event.error || new Error(event.message), {
      context: 'window.onerror',
      silent: false,
    });
    
    // Empêche l'erreur de s'afficher dans la console (optionnel)
    // event.preventDefault();
  });
  
  // Capturer les rejets de promesses non gérés
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, {
      context: 'unhandledrejection',
      silent: false,
    });
    
    // Empêche l'erreur de s'afficher dans la console (optionnel)
    // event.preventDefault();
  });
  
  // Informer que le gestionnaire d'erreurs est initialisé
  console.info('[ErrorHandler] Gestionnaire global d\'erreurs initialisé');
  
  return {
    isInitialized: true,
  };
}; 