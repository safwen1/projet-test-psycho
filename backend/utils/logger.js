const fs = require('fs');
const path = require('path');

// Configuration du logger
const config = {
  logToConsole: true,                      // Afficher les logs dans la console
  logToFile: process.env.NODE_ENV === 'production', // Enregistrer les logs dans un fichier en production
  logDirectory: path.join(__dirname, '../logs'),
  errorLogFile: 'error.log',
  errorMaxSize: 10 * 1024 * 1024,          // 10 Mo
  errorMaxFiles: 5,                        // Nombre de fichiers de rotation
  logLevel: process.env.LOG_LEVEL || 'info' // Niveau de log par défaut
};

// Niveaux de log
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Vérifier si le niveau de log est suffisant pour enregistrer
const shouldLog = (level) => {
  return LOG_LEVELS[level] <= LOG_LEVELS[config.logLevel];
};

// Couleurs pour la console
const colors = {
  error: '\x1b[31m', // Rouge
  warn: '\x1b[33m',  // Jaune
  info: '\x1b[36m',  // Cyan
  http: '\x1b[35m',  // Magenta
  debug: '\x1b[32m', // Vert
  reset: '\x1b[0m'   // Reset
};

// Formatter l'heure
const getTimestamp = () => {
  return new Date().toISOString();
};

// Créer le répertoire de logs s'il n'existe pas
if (config.logToFile) {
  try {
    if (!fs.existsSync(config.logDirectory)) {
      fs.mkdirSync(config.logDirectory, { recursive: true });
    }
  } catch (error) {
    console.error('Impossible de créer le répertoire de logs:', error);
  }
}

// Fonction pour enregistrer dans un fichier
const logToFile = (level, message, meta = {}) => {
  if (!config.logToFile) return;
  
  try {
    const logPath = path.join(config.logDirectory, config.errorLogFile);
    const timestamp = getTimestamp();
    
    // Formater le message
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    // Écrire dans le fichier
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
    
    // Vérifier la taille du fichier pour la rotation
    const stats = fs.statSync(logPath);
    if (stats.size > config.errorMaxSize) {
      rotateLogFiles();
    }
  } catch (error) {
    console.error('Erreur lors de l\'écriture du log:', error);
  }
};

// Fonction pour faire la rotation des fichiers de log
const rotateLogFiles = () => {
  try {
    for (let i = config.errorMaxFiles - 1; i > 0; i--) {
      const oldFile = path.join(config.logDirectory, `${config.errorLogFile}.${i}`);
      const newFile = path.join(config.logDirectory, `${config.errorLogFile}.${i + 1}`);
      
      if (fs.existsSync(oldFile)) {
        fs.renameSync(oldFile, newFile);
      }
    }
    
    const oldFile = path.join(config.logDirectory, config.errorLogFile);
    const newFile = path.join(config.logDirectory, `${config.errorLogFile}.1`);
    
    if (fs.existsSync(oldFile)) {
      fs.renameSync(oldFile, newFile);
      fs.writeFileSync(oldFile, ''); // Créer un nouveau fichier vide
    }
  } catch (error) {
    console.error('Erreur lors de la rotation des logs:', error);
  }
};

// Formatter un objet pour la console
const formatObject = (obj) => {
  if (!obj) return '';
  
  try {
    return typeof obj === 'object' ? JSON.stringify(obj, null, 2) : obj;
  } catch (e) {
    return String(obj);
  }
};

// Méthode pour enregistrer un message
const log = (level, message, meta = {}) => {
  if (!shouldLog(level)) return;
  
  const timestamp = getTimestamp();
  const formattedMeta = formatObject(meta);
  
  // Log dans la console
  if (config.logToConsole) {
    const color = colors[level] || colors.reset;
    const prefix = `${timestamp} [${level.toUpperCase()}]:`;
    
    console.log(`${color}${prefix}${colors.reset} ${message}`);
    
    if (formattedMeta) {
      console.log(formattedMeta);
    }
  }
  
  // Log dans un fichier
  logToFile(level, message, meta);
};

// Méthodes spécifiques pour chaque niveau de log
const logger = {
  error: (message, meta = {}) => log('error', message, meta),
  warn: (message, meta = {}) => log('warn', message, meta),
  info: (message, meta = {}) => log('info', message, meta),
  http: (message, meta = {}) => log('http', message, meta),
  debug: (message, meta = {}) => log('debug', message, meta),
  
  // Méthode pour enregistrer une erreur avec sa stack trace
  logError: (error, context = {}) => {
    if (!error) return;
    
    const errorDetails = {
      name: error.name || 'Error',
      message: error.message || String(error),
      stack: error.stack || 'No stack trace available',
      code: error.code || error.statusCode || error.status || 'UNKNOWN',
      context
    };
    
    log('error', errorDetails.message, errorDetails);
    return errorDetails;
  }
};

module.exports = logger; 