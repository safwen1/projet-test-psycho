// Classes d'erreurs personnalisées pour différents types d'erreurs

// Classe de base pour toutes les erreurs API
class APIError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erreur de validation (données d'entrée invalides)
class ValidationError extends APIError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// Erreur d'authentification
class AuthenticationError extends APIError {
  constructor(message, details = null) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

// Erreur d'autorisation
class AuthorizationError extends APIError {
  constructor(message, details = null) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

// Ressource non trouvée
class NotFoundError extends APIError {
  constructor(message, details = null) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
  }
}

// Erreur de service externe (API tiers, base de données, etc.)
class ExternalServiceError extends APIError {
  constructor(message, details = null) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
}

// Erreur interne du serveur
class InternalError extends APIError {
  constructor(message, details = null) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

// Fonction utilitaire pour formatter les erreurs avant de les renvoyer au client
const formatError = (err) => {
  // Pour les erreurs API, on utilise directement le format existant
  if (err instanceof APIError) {
    return {
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details,
      }
    };
  }
  
  // Pour les erreurs standard, on les transforme en erreur interne
  console.error('Erreur non gérée:', err);
  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Une erreur interne est survenue sur le serveur.',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    }
  };
};

module.exports = {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ExternalServiceError,
  InternalError,
  formatError
}; 