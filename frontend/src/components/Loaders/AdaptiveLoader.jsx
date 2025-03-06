import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

// Animation d'onde pour la connexion lente
const waveAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

// Animation de rotation pour la connexion normale
const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Animation de pulsation pour la connexion rapide
const pulseAnimation = keyframes`
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(0.95); }
`;

// Conteneur principal stylisé
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem;
`;

// Différents types de loaders
const SlowLoader = styled.div`
  display: flex;
  gap: 8px;
  
  div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.primary || '#4a7aff'};
    animation: ${waveAnimation} 1.5s infinite ease-in-out;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const MediumLoader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary || '#4a7aff'};
  animation: ${rotateAnimation} 1s infinite linear;
`;

const FastLoader = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary || '#4a7aff'};
  opacity: 0.7;
  animation: ${pulseAnimation} 0.8s infinite ease-in-out;
`;

// Message de chargement stylisé
const LoadingMessage = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text || '#333'};
  text-align: center;
  max-width: 300px;
`;

// Information sur la connexion
const ConnectionInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight || '#666'};
  
  span {
    font-weight: 600;
    color: ${props => {
      switch(props.type) {
        case 'slow': return props.theme.colors.error || '#e74c3c';
        case 'medium': return props.theme.colors.warning || '#f39c12';
        case 'fast': return props.theme.colors.success || '#2ecc71';
        default: return props.theme.colors.textLight || '#666';
      }
    }};
  }
`;

/**
 * Composant de chargement adaptatif qui s'ajuste en fonction de la vitesse de connexion
 * @param {Object} props - Propriétés du composant
 * @param {string} props.message - Message à afficher pendant le chargement
 * @param {boolean} props.showConnectionInfo - Afficher ou non les infos de connexion
 * @param {string} props.size - Taille du loader ('small', 'medium', 'large')
 * @returns {JSX.Element} - Composant de chargement adaptatif
 */
const AdaptiveLoader = ({ 
  message = "Chargement en cours...", 
  showConnectionInfo = true,
  size = 'medium'
}) => {
  const networkStatus = useNetworkStatus();
  const [loaderType, setLoaderType] = useState('medium');
  const [connectionMessage, setConnectionMessage] = useState('');
  
  useEffect(() => {
    if (!networkStatus.online) {
      setLoaderType('slow');
      setConnectionMessage('Vous êtes hors ligne. Vérifiez votre connexion internet.');
      return;
    }
    
    // Déterminer le type de loader en fonction de la connexion
    if (networkStatus.effectiveType === 'slow') {
      setLoaderType('slow');
      setConnectionMessage('Connexion lente détectée. Certaines fonctionnalités peuvent être limitées.');
    } else if (networkStatus.effectiveType === 'medium') {
      setLoaderType('medium');
      setConnectionMessage('Connexion moyenne.');
    } else {
      setLoaderType('fast');
      setConnectionMessage('Connexion rapide.');
    }
  }, [networkStatus]);
  
  // Rendu du loader approprié
  const renderLoader = () => {
    switch (loaderType) {
      case 'slow':
        return <SlowLoader><div></div><div></div><div></div></SlowLoader>;
      case 'fast':
        return <FastLoader />;
      case 'medium':
      default:
        return <MediumLoader />;
    }
  };
  
  return (
    <LoaderContainer>
      {renderLoader()}
      <LoadingMessage>{message}</LoadingMessage>
      {showConnectionInfo && networkStatus.online && (
        <ConnectionInfo type={loaderType}>
          <span>{loaderType === 'slow' ? '⚠️' : '🌐'}</span> {connectionMessage}
        </ConnectionInfo>
      )}
      {!networkStatus.online && (
        <ConnectionInfo type="slow">
          <span>⚠️</span> {connectionMessage}
        </ConnectionInfo>
      )}
    </LoaderContainer>
  );
};

export default AdaptiveLoader; 