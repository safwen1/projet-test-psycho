import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationWarningDialog from '../components/Dialogs/NavigationWarningDialog';

// Création du contexte de navigation
const NavigationContext = createContext(null);

/**
 * Fournisseur du contexte de navigation
 * Gère la prévention de navigation au niveau de l'application
 */
export const NavigationProvider = ({ children }) => {
  const [isPreventingNavigation, setIsPreventingNavigation] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState(
    "Attention ! Si vous quittez cette page, votre progression sera perdue. Êtes-vous sûr de vouloir continuer ?"
  );
  const [dialogTitle, setDialogTitle] = useState("Quitter la page ?");
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const lastLocationRef = useRef(location);

  // Gère les changements de location pour la navigation interne
  useEffect(() => {
    if (!isPreventingNavigation) {
      lastLocationRef.current = location;
      return;
    }

    // Si la prévention est active et que la location a changé
    if (location !== lastLocationRef.current) {
      // Annule la navigation automatique
      setPendingPath(location);
      setShowDialog(true);
      
      // Note: Nous ne bloquons plus directement la navigation ici
      // car cela est maintenant géré au niveau des composants de test
    }
  }, [location, isPreventingNavigation]);

  /**
   * Active la prévention de navigation
   */
  const enablePreventNavigation = (message, title) => {
    if (message) setNavigationMessage(message);
    if (title) setDialogTitle(title);
    setIsPreventingNavigation(true);
    
    // Note: La prévention directe des rechargements est maintenant gérée 
    // directement dans les composants de test pour plus d'efficacité
  };

  /**
   * Désactive la prévention de navigation
   */
  const disablePreventNavigation = () => {
    setIsPreventingNavigation(false);
    
    // Note: La suppression des écouteurs d'événements est maintenant gérée 
    // directement dans les composants de test
  };

  /**
   * Confirme la navigation et continue vers la destination
   */
  const confirmNavigation = () => {
    setShowDialog(false);
    setIsPreventingNavigation(false);
    
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  /**
   * Annule la navigation et reste sur la page actuelle
   */
  const cancelNavigation = () => {
    setShowDialog(false);
    setPendingPath(null);
    // Reste sur la page actuelle
  };

  // Valeur du contexte exposée aux composants
  const contextValue = {
    isPreventingNavigation,
    enablePreventNavigation,
    disablePreventNavigation,
    setNavigationMessage,
    setDialogTitle,
    navigationMessage,
    dialogTitle
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
      
      {/* Dialogue d'avertissement de navigation */}
      <NavigationWarningDialog
        open={showDialog}
        title={dialogTitle}
        message={navigationMessage}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </NavigationContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de navigation
 */
export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationContext doit être utilisé à l'intérieur d'un NavigationProvider");
  }
  return context;
};

export default NavigationContext; 