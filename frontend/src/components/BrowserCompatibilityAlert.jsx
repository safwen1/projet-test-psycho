import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createBrowserCompatibilityReport } from '../services/browserDetectionService';

// Styles
const AlertContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.severity === 'high' ? '#d32f2f' : 
    props.severity === 'medium' ? '#f57c00' : '#4caf50'};
  color: white;
  z-index: 9999;
  padding: 12px 24px;
  font-size: 14px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 10px 15px;
  }
`;

const AlertMessage = styled.div`
  flex: 1;
`;

const ActionButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 15px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const BrowserInfo = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
`;

/**
 * Composant qui vérifie la compatibilité du navigateur et affiche une alerte si nécessaire
 */
const BrowserCompatibilityAlert = () => {
  const [report, setReport] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    // Récupérer un rapport de compatibilité du navigateur
    const checkBrowserCompatibility = async () => {
      try {
        // Vérifier si l'alerte a déjà été ignorée dans cette session
        if (sessionStorage.getItem('browserAlertDismissed') === 'true') {
          setDismissed(true);
          return;
        }
        
        const compatibilityReport = createBrowserCompatibilityReport();
        setReport(compatibilityReport);
        
        // Enregistrer le rapport à des fins d'analyse
        console.info('[BrowserCompatibility]', compatibilityReport);
      } catch (error) {
        console.error('Erreur lors de la vérification de compatibilité:', error);
      }
    };
    
    checkBrowserCompatibility();
  }, []);
  
  // Si l'alerte est masquée ou s'il n'y a pas de rapport, ne rien afficher
  if (dismissed || !report) {
    return null;
  }
  
  // Si le navigateur est totalement compatible, ne rien afficher
  if (report.isFullyCompatible) {
    return null;
  }

  // Déterminer la sévérité du problème
  let severity = 'low';
  let message = '';
  let actionText = '';
  let actionUrl = '';
  
  if (!report.essentialFeaturesSupported) {
    // Fonctionnalités essentielles manquantes
    severity = 'high';
    message = `Votre navigateur ne prend pas en charge certaines fonctionnalités essentielles pour cette application. Pour une expérience optimale, veuillez utiliser un navigateur moderne.`;
    actionText = 'Mettre à niveau';
    
    // Lien adapté selon le système d'exploitation
    if (report.browserInfo.isIOS) {
      actionUrl = 'https://apps.apple.com/app/safari/id1146562112';
    } else if (report.browserInfo.isAndroid) {
      actionUrl = 'https://play.google.com/store/apps/details?id=com.android.chrome';
    } else {
      actionUrl = 'https://www.google.com/chrome/';
    }
  } else if (report.compatibilityScore < 70) {
    // Compatible mais avec des limitations
    severity = 'medium';
    message = `Votre navigateur est compatible avec cette application, mais certaines fonctionnalités peuvent ne pas fonctionner correctement.`;
    actionText = 'En savoir plus';
    actionUrl = '/compatibility-info';
  } else {
    // Compatible avec des avertissements mineurs
    severity = 'low';
    message = `Votre navigateur prend en charge la plupart des fonctionnalités, mais certaines améliorations peuvent ne pas être disponibles.`;
  }
  
  // Gérer la fermeture de l'alerte
  const handleDismiss = () => {
    setDismissed(true);
    
    // Mémoriser que l'alerte a été ignorée pour cette session
    sessionStorage.setItem('browserAlertDismissed', 'true');
  };
  
  return (
    <AlertContainer severity={severity}>
      <AlertMessage>
        {message}
        <BrowserInfo>
          Détecté: {report.browserInfo.browser} sur {report.browserInfo.os} ({report.browserInfo.device})
        </BrowserInfo>
      </AlertMessage>
      <div>
        {actionText && actionUrl && (
          <ActionButton onClick={() => window.open(actionUrl, '_blank')}>
            {actionText}
          </ActionButton>
        )}
        <CloseButton onClick={handleDismiss} aria-label="Fermer l'alerte">
          ×
        </CloseButton>
      </div>
    </AlertContainer>
  );
};

export default BrowserCompatibilityAlert; 