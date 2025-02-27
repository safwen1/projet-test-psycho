import { useEffect } from 'react';
import { useNavigationContext } from '../context/NavigationContext';

/**
 * Hook personnalisé pour empêcher la navigation accidentelle pendant un test
 * 
 * @param {boolean} isActive - Indique si la prévention de navigation est active
 * @param {string} message - Message à afficher lors d'une tentative de navigation
 * @param {string} title - Titre de la boîte de dialogue de confirmation
 */
const usePreventNavigation = (isActive, message, title) => {
  const { enablePreventNavigation, disablePreventNavigation } = useNavigationContext();

  useEffect(() => {
    if (isActive) {
      // Active la prévention de navigation au niveau du contexte
      enablePreventNavigation(message, title);
      
      // Note: La prévention directe des rechargements est maintenant gérée 
      // directement dans les composants de test pour plus d'efficacité
    }

    return () => {
      if (isActive) {
        disablePreventNavigation();
      }
    };
  }, [isActive, message, title, enablePreventNavigation, disablePreventNavigation]);
};

export default usePreventNavigation; 