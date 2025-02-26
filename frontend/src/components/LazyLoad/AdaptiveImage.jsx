import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNetwork } from '../../context/NetworkContext';

// Styles des différents états de l'image
const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: ${props => props.height || 'auto'};
  background-color: #f0f0f0;
  border-radius: ${props => props.borderRadius || '4px'};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  opacity: ${props => (props.loaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const Placeholder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const ErrorPlaceholder = styled(Placeholder)`
  background-color: #fff0f0;
  color: #e74c3c;
`;

/**
 * Composant d'image adaptatif qui charge différentes résolutions en fonction de la connexion
 * @param {Object} props - Propriétés du composant
 * @param {string} props.src - URL de l'image haute qualité
 * @param {string} props.lowQualitySrc - URL de l'image basse qualité
 * @param {string} props.mediumQualitySrc - URL de l'image moyenne qualité
 * @param {string} props.alt - Texte alternatif de l'image
 * @param {string} props.placeholderText - Texte à afficher durant le chargement
 * @param {string} props.height - Hauteur de l'image (ex: '200px', '100%')
 * @param {string} props.objectFit - Style d'ajustement de l'image
 * @param {string} props.borderRadius - Rayon de bordure de l'image
 * @param {boolean} props.lazy - Activer le chargement paresseux (IntersectionObserver)
 * @param {Function} props.onLoad - Fonction appelée quand l'image est chargée
 * @param {Function} props.onError - Fonction appelée en cas d'erreur
 * @returns {JSX.Element} - Composant d'image adaptatif
 */
const AdaptiveImage = ({
  src,
  lowQualitySrc,
  mediumQualitySrc,
  alt = '',
  placeholderText = 'Chargement de l\'image...',
  height = 'auto',
  objectFit = 'cover',
  borderRadius = '4px',
  lazy = true,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const imageRef = useRef(null);
  const { resourceOptions, networkStatus } = useNetwork();

  // Sélection de la source d'image en fonction de la qualité de connexion
  const getAppropriateSource = () => {
    if (!networkStatus.online || resourceOptions.imageQuality === 'low') {
      return lowQualitySrc || src;
    } else if (resourceOptions.imageQuality === 'medium') {
      return mediumQualitySrc || src;
    }
    return src;
  };

  const selectedSrc = getAppropriateSource();

  // Configuration de l'observateur d'intersection pour le chargement paresseux
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, {
      rootMargin: '200px', // Précharge l'image quand elle est à 200px du viewport
      threshold: 0.01
    });

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.disconnect();
      }
    };
  }, [lazy, shouldLoad]);

  // Gestionnaires d'événements
  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <ImageContainer 
      ref={imageRef} 
      height={height} 
      borderRadius={borderRadius}
      {...props}
    >
      {shouldLoad && (
        <StyledImage
          src={selectedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loaded={isLoaded}
          objectFit={objectFit}
          loading={lazy ? "lazy" : "eager"}
        />
      )}

      {!isLoaded && !hasError && (
        <Placeholder visible={!isLoaded}>
          {placeholderText}
        </Placeholder>
      )}

      {hasError && (
        <ErrorPlaceholder visible={hasError}>
          Impossible de charger l'image
        </ErrorPlaceholder>
      )}
    </ImageContainer>
  );
};

export default AdaptiveImage; 