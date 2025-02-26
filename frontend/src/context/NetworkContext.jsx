import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

// Création du contexte
const NetworkContext = createContext(null);

/**
 * Provider pour fournir l'état du réseau et des chargements à toute l'application
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Enfants du composant
 * @returns {JSX.Element} - Contexte pour l'état du réseau
 */
export const NetworkProvider = ({ children }) => {
  const networkStatus = useNetworkStatus();
  
  // État pour suivre les chargements en cours
  const [loadingRequests, setLoadingRequests] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Adapte la qualité de l'interface en fonction de la connexion
  const [interfaceQuality, setInterfaceQuality] = useState('high');
  
  // Définit les options pour les images et resources
  const [resourceOptions, setResourceOptions] = useState({
    imageQuality: 'high', // 'low', 'medium', 'high'
    loadAllResources: true,
    prefetchEnabled: true,
  });
  
  // Met à jour les options de ressources en fonction de la vitesse de connexion
  useEffect(() => {
    if (!networkStatus.online) {
      setInterfaceQuality('low');
      setResourceOptions({
        imageQuality: 'low',
        loadAllResources: false,
        prefetchEnabled: false,
      });
      return;
    }
    
    switch (networkStatus.effectiveType) {
      case 'slow':
        setInterfaceQuality('low');
        setResourceOptions({
          imageQuality: 'low',
          loadAllResources: false,
          prefetchEnabled: false,
        });
        break;
      case 'medium':
        setInterfaceQuality('medium');
        setResourceOptions({
          imageQuality: 'medium',
          loadAllResources: true,
          prefetchEnabled: true,
        });
        break;
      case 'fast':
      default:
        setInterfaceQuality('high');
        setResourceOptions({
          imageQuality: 'high',
          loadAllResources: true,
          prefetchEnabled: true,
        });
        break;
    }
  }, [networkStatus]);
  
  // Vérifie s'il y a des chargements en cours
  useEffect(() => {
    const hasActiveRequests = Object.keys(loadingRequests).length > 0;
    setIsLoading(hasActiveRequests);
  }, [loadingRequests]);
  
  // Ajoute une requête en cours de chargement
  const addLoadingRequest = (id, message = 'Chargement en cours...') => {
    setLoadingRequests(prev => ({
      ...prev,
      [id]: { message, timestamp: Date.now() }
    }));
  };
  
  // Supprime une requête terminée
  const removeLoadingRequest = (id) => {
    setLoadingRequests(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };
  
  // Obtient le message de chargement actuel le plus récent
  const getCurrentLoadingMessage = () => {
    if (Object.keys(loadingRequests).length === 0) {
      return 'Chargement en cours...';
    }
    
    // Récupère le message de la requête la plus récente
    const mostRecent = Object.entries(loadingRequests).reduce(
      (most, [id, { timestamp, message }]) => {
        return timestamp > most.timestamp ? { id, timestamp, message } : most;
      },
      { id: null, timestamp: 0, message: 'Chargement en cours...' }
    );
    
    return mostRecent.message;
  };
  
  // Valeur du contexte à fournir
  const contextValue = {
    networkStatus,
    isLoading,
    interfaceQuality,
    resourceOptions,
    loadingRequests,
    addLoadingRequest,
    removeLoadingRequest,
    getCurrentLoadingMessage,
  };
  
  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte réseau
 * @returns {Object} - État du réseau et fonctions de gestion des chargements
 */
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  
  if (!context) {
    throw new Error('useNetwork doit être utilisé à l\'intérieur d\'un NetworkProvider');
  }
  
  return context;
};

export default NetworkContext; 