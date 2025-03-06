import React from 'react';
import PropTypes from 'prop-types';

const ErrorTypes = {
  CRITICAL: 'critical',   // Erreurs bloquantes (rouge)
  WARNING: 'warning',     // Avertissements (orange)
  INFO: 'info'            // Informations (bleu)
};

const ErrorDisplay = ({ 
  error,
  type = ErrorTypes.CRITICAL,
  showDetails = false,
  onRetry = null,
  onDismiss = null,
  className = ''
}) => {
  if (!error) return null;
  
  // Extraction du message d'erreur (en fonction du format)
  const message = typeof error === 'string' 
    ? error 
    : error.message || 'Une erreur est survenue';
  
  // Extraction des détails (uniquement si on veut les afficher)
  const details = showDetails && typeof error !== 'string' 
    ? error.details || null
    : null;
    
  // Définition des classes CSS en fonction du type d'erreur
  const getTypeClass = () => {
    switch (type) {
      case ErrorTypes.WARNING:
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case ErrorTypes.INFO:
        return 'bg-blue-50 border-blue-300 text-blue-800';
      case ErrorTypes.CRITICAL:
      default:
        return 'bg-red-50 border-red-300 text-red-800';
    }
  };
  
  // Icône en fonction du type d'erreur
  const getIcon = () => {
    switch (type) {
      case ErrorTypes.WARNING:
        return (
          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case ErrorTypes.INFO:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case ErrorTypes.CRITICAL:
      default:
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`rounded-md border p-4 mb-4 ${getTypeClass()} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-grow">
          <h3 className="text-sm font-medium">{message}</h3>
          {details && (
            <div className="mt-2 text-sm">
              <pre className="whitespace-pre-wrap p-2 bg-white bg-opacity-20 rounded overflow-auto max-h-40">
                {typeof details === 'object' ? JSON.stringify(details, null, 2) : details}
              </pre>
            </div>
          )}
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`inline-flex px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${type === ErrorTypes.CRITICAL ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500' : 
                    type === ErrorTypes.WARNING ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 focus:ring-amber-500' :
                    'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500'}`}
                >
                  Réessayer
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="inline-flex px-3 py-1.5 rounded-md text-sm font-medium bg-white bg-opacity-30 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Fermer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string,
      details: PropTypes.any,
      code: PropTypes.string
    })
  ]),
  type: PropTypes.oneOf(Object.values(ErrorTypes)),
  showDetails: PropTypes.bool,
  onRetry: PropTypes.func,
  onDismiss: PropTypes.func,
  className: PropTypes.string
};

export { ErrorDisplay, ErrorTypes }; 