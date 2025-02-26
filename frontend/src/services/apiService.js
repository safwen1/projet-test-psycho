/**
 * Service de gestion des requêtes API avec mise en cache
 */

// Cache pour stocker les réponses des requêtes
const apiCache = {
  cache: new Map(),
  
  // Récupère une entrée du cache avec vérification de l'expiration
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Vérifie si l'entrée a expiré
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  // Ajoute ou met à jour une entrée dans le cache
  set(key, data, ttl = 300000) { // 5 minutes par défaut
    const expiry = ttl > 0 ? Date.now() + ttl : null;
    this.cache.set(key, { data, expiry });
  },
  
  // Supprime une entrée du cache
  remove(key) {
    this.cache.delete(key);
  },
  
  // Vide complètement le cache
  clear() {
    this.cache.clear();
  }
};

/**
 * Effectue une requête API avec gestion du cache
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête (method, headers, body, useCache, cacheTTL)
 * @returns {Promise<any>} - Réponse de la requête
 */
export const apiRequest = async (url, options = {}) => {
  const {
    method = 'GET',
    headers = { 'Content-Type': 'application/json' },
    body,
    useCache = true,
    cacheTTL = 300000, // 5 minutes par défaut
    signal = null, // AbortSignal pour annuler la requête
  } = options;

  // Génère une clé unique pour le cache
  const cacheKey = `${method}:${url}:${body ? JSON.stringify(body) : ''}`;
  
  // Pour les requêtes GET, vérifie d'abord le cache si activé
  if (method === 'GET' && useCache) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Stocke la réponse dans le cache pour les requêtes GET
    if (method === 'GET' && useCache) {
      apiCache.set(cacheKey, data, cacheTTL);
    }
    
    return data;
  } catch (error) {
    // Ne pas relancer l'erreur si la requête a été annulée
    if (error.name === 'AbortError') {
      console.log('Requête annulée');
      return null;
    }
    
    console.error('Erreur API:', error);
    throw error;
  }
};

/**
 * Crée un contrôleur d'abandon pour annuler une requête
 * @returns {Object} - Contrôleur et signal d'abandon
 */
export const createAbortController = () => {
  return new AbortController();
};

export default {
  get: (url, options = {}) => apiRequest(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => apiRequest(url, { 
    ...options, 
    method: 'POST',
    body: data,
    useCache: false // Par défaut, pas de cache pour les requêtes POST
  }),
  put: (url, data, options = {}) => apiRequest(url, { 
    ...options, 
    method: 'PUT',
    body: data,
    useCache: false 
  }),
  delete: (url, options = {}) => apiRequest(url, { 
    ...options, 
    method: 'DELETE',
    useCache: false 
  }),
  clearCache: () => apiCache.clear()
}; 