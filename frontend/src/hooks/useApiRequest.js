import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import apiService from '../services/apiService';
import { useNetwork } from '../context/NetworkContext';

/**
 * Hook personnalisé pour effectuer des requêtes API avec gestion du chargement et de l'état du réseau
 * @param {string} initialUrl - URL initiale de la requête
 * @param {Object} initialOptions - Options initiales de la requête
 * @returns {Object} - État de la requête et méthodes pour la manipuler
 */
export const useApiRequest = (initialUrl = null, initialOptions = {}) => {
  const [url, setUrl] = useState(initialUrl);
  const [options, setOptions] = useState(initialOptions);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(uuidv4());
  
  // Contexte réseau pour la gestion des chargements et de l'état de la connexion
  const { 
    addLoadingRequest, 
    removeLoadingRequest, 
    networkStatus 
  } = useNetwork();
  
  // Configuration par défaut
  const defaultOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    useCache: true,
    cacheTTL: networkStatus.effectiveType === 'slow' ? 600000 : 300000, // 10 min pour connexions lentes, 5 min sinon
    retryOnFailure: true,
    maxRetries: 3,
    retryDelay: networkStatus.effectiveType === 'slow' ? 5000 : 2000, // 5s pour connexions lentes, 2s sinon
    loadingMessage: 'Chargement en cours...',
    useCancelToken: true,
  };
  
  /**
   * Effectue une requête API avec gestion des erreurs et retry automatique
   */
  const fetchData = useCallback(async (url, options = {}) => {
    if (!url) return;
    
    const mergedOptions = { ...defaultOptions, ...options };
    const { 
      retryOnFailure, 
      maxRetries, 
      retryDelay, 
      loadingMessage, 
      useCancelToken 
    } = mergedOptions;
    
    try {
      // Prepare le contrôleur d'abort si nécessaire
      if (useCancelToken) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        mergedOptions.signal = abortControllerRef.current.signal;
      }
      
      // Met à jour l'état de chargement
      setIsLoading(true);
      setError(null);
      
      // Ajoute la requête au contexte de chargement
      const requestId = requestIdRef.current;
      addLoadingRequest(requestId, loadingMessage);
      
      // Effectue la requête via le service API
      const result = await apiService.apiRequest(url, mergedOptions);
      
      // Met à jour les données et réinitialise les états
      setData(result);
      setRetryCount(0);
      setIsRetrying(false);
      
      return result;
    } catch (error) {
      setError(error);
      
      // Gestion automatique de retry en cas d'erreur et si la connexion est disponible
      if (
        retryOnFailure && 
        networkStatus.online && 
        retryCount < maxRetries && 
        error.name !== 'AbortError'
      ) {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        
        // Délai avant de réessayer
        setTimeout(() => {
          setIsRetrying(false);
          fetchData(url, mergedOptions);
        }, retryDelay);
      }
      
      return null;
    } finally {
      // Si on ne retry pas, on indique que le chargement est terminé
      if (!isRetrying) {
        setIsLoading(false);
        removeLoadingRequest(requestIdRef.current);
      }
    }
  }, [
    networkStatus, 
    addLoadingRequest, 
    removeLoadingRequest, 
    retryCount, 
    isRetrying
  ]);
  
  /**
   * Exécute la requête lorsque l'URL ou les options changent
   */
  useEffect(() => {
    if (url) {
      fetchData(url, options);
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      removeLoadingRequest(requestIdRef.current);
    };
  }, [url, options, fetchData, removeLoadingRequest]);
  
  /**
   * Change l'URL et les options, puis exécute la requête
   */
  const request = useCallback((newUrl, newOptions = {}) => {
    setUrl(newUrl);
    setOptions(newOptions);
  }, []);
  
  /**
   * Annule la requête en cours
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      removeLoadingRequest(requestIdRef.current);
      setIsLoading(false);
    }
  }, [removeLoadingRequest]);
  
  /**
   * Réexécute la dernière requête
   */
  const refetch = useCallback(() => {
    requestIdRef.current = uuidv4();
    fetchData(url, options);
  }, [url, options, fetchData]);
  
  /**
   * Met à jour les données manuellement
   */
  const updateData = useCallback((updater) => {
    setData(prev => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return updater;
    });
  }, []);
  
  return {
    data,
    error,
    isLoading,
    isRetrying,
    retryCount,
    request,
    cancelRequest,
    refetch,
    updateData,
  };
};

export default useApiRequest; 