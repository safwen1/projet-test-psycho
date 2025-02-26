import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter et suivre l'état de la connexion réseau
 * @returns {Object} État du réseau et informations sur la connexion
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    connectionType: null, // '4g', '3g', '2g', 'slow-2g', 'wifi', etc.
    effectiveType: 'unknown', // 'fast', 'medium', 'slow'
    downlink: 0, // Vitesse de téléchargement en Mbps
    rtt: 0, // Temps de réponse en ms
    saveData: false, // Mode économie de données activé
  });

  useEffect(() => {
    // Gestion des événements de connexion
    const handleOnline = () => 
      setNetworkStatus(prev => ({ ...prev, online: true }));
      
    const handleOffline = () => 
      setNetworkStatus(prev => ({ ...prev, online: false }));

    // Gestion des changements de connexion via Network Information API
    const handleConnectionChange = () => {
      const connection = navigator.connection || 
                         navigator.mozConnection || 
                         navigator.webkitConnection;
                         
      if (connection) {
        let effectiveType = 'unknown';
        
        // Détermine la qualité de connexion
        if (connection.effectiveType === '4g' || connection.downlink > 5) {
          effectiveType = 'fast';
        } else if (connection.effectiveType === '3g' || (connection.downlink > 1 && connection.downlink <= 5)) {
          effectiveType = 'medium';
        } else {
          effectiveType = 'slow';
        }
        
        setNetworkStatus({
          online: navigator.onLine,
          connectionType: connection.type,
          effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      }
    };

    // Ajout des écouteurs d'événements
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = navigator.connection || 
                       navigator.mozConnection || 
                       navigator.webkitConnection;
                       
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      handleConnectionChange(); // Initialisation des valeurs
    }

    // Nettoyage des écouteurs
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return networkStatus;
};

export default useNetworkStatus; 