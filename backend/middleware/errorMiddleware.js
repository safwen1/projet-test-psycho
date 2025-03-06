const { formatError } = require('../config/error');
const logger = require('../utils/logger');

// Middleware pour capturer les erreurs 404 (routes non trouvées)
const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route non trouvée: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware pour gérer toutes les erreurs de l'application
const errorHandlerMiddleware = (err, req, res, next) => {
  // Utiliser notre logger structuré pour enregistrer l'erreur
  logger.logError(err, {
    url: req.originalUrl,
    method: req.method,
    query: req.query,
    params: req.params,
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : 'Non applicable',
    headers: {
      userAgent: req.get('User-Agent'),
      contentType: req.get('Content-Type'),
      authorization: req.get('Authorization') ? 'Present' : 'None'
    },
    ip: req.ip
  });
  
  // Si le status n'est pas défini, on met 500 par défaut
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  
  // Formater l'erreur pour le client
  const formattedError = formatError(err);
  
  // On ajoute des informations de débogage en développement
  if (process.env.NODE_ENV === 'development') {
    formattedError.debugInfo = {
      stack: err.stack,
      path: req.path,
      method: req.method
    };
  }
  
  res.status(statusCode).json(formattedError);
};

module.exports = {
  notFoundMiddleware,
  errorHandlerMiddleware
}; 