import React, { useState, useEffect, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazyRoute } from '../components/LazyLoad/withLazyLoading';
import { useNetwork } from '../context/NetworkContext';
import AdaptiveLoader from '../components/Loaders/AdaptiveLoader';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Import direct comme solution de secours
import DirectIntroBigFive from '../pages/BigFive/IntroBigFive';

// Chargement paresseux des pages
const Home = lazyRoute('pages/Home/Home', { 
  fallback: 'Chargement de la page d\'accueil...',
  simplified: true,
  title: 'Accueil',
  description: 'Bienvenue sur l\'application de tests psychométriques'
});

// Routes du test RIASEC avec chargement paresseux
const IntroRiasec = lazyRoute('pages/RIASEC/IntroRiasec', { 
  fallback: 'Chargement de l\'introduction du test RIASEC...' 
});

const AppRiasecTest = lazyRoute('pages/RIASEC/AppRiasecTest', { 
  fallback: 'Chargement du test RIASEC...'
});

const ResultRiasec = lazyRoute('pages/RIASEC/ResultRiasec', { 
  fallback: 'Chargement des résultats du test RIASEC...'
});

// Routes du test Big Five avec chargement paresseux
const IntroBigFive = React.lazy(() => {
  console.log('Chargement direct de IntroBigFive');
  return import('../pages/BigFive/IntroBigFive')
    .then(module => {
      console.log('IntroBigFive chargé avec succès');
      return module;
    })
    .catch(error => {
      console.error('Erreur lors du chargement direct de IntroBigFive:', error);
      // En cas d'échec, utiliser le composant importé directement
      return { default: DirectIntroBigFive };
    });
});

const AppBigFiveTest = lazyRoute('pages/BigFive/AppBigFiveTest', { 
  fallback: 'Chargement du test Big Five...'
});

const ResultBigFive = lazyRoute('pages/BigFive/ResultBigFive', { 
  fallback: 'Chargement des résultats du test Big Five...'
});

// Page de résultat générique
const Resultat = lazyRoute('pages/Resultat/Resultat', { 
  fallback: 'Chargement de la page de résultat...',
  simplified: true,
  title: 'Résultat',
  description: 'Résultat de votre test psychométrique'
});

// Composant de secours en cas d'échec du chargement
const FallbackComponent = ({ title, message, onRetry }) => (
  <div className="fallback-component">
    <h2>{title || "Problème de chargement"}</h2>
    <p>{message || "Le composant n'a pas pu être chargé correctement."}</p>
    <button onClick={onRetry}>Réessayer</button>
  </div>
);

// Route pour BigFive avec gestion du suspense locale
const BigFiveIntroRoute = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Essayez d'abord d'utiliser le module préchargé
        if (window.__preloadedModules?.introBigFive) {
          console.log('Utilisation du module préchargé pour IntroBigFive');
          setComponent(() => window.__preloadedModules.introBigFive.default);
          setIsLoaded(true);
          return;
        }

        // Sinon, essayez de le charger normalement
        const module = await import('../pages/BigFive/IntroBigFive');
        console.log('Module IntroBigFive chargé dynamiquement');
        setComponent(() => module.default);
        setIsLoaded(true);
      } catch (error) {
        console.error('Erreur lors du chargement du composant IntroBigFive:', error);
        
        // Tentative de récupération via la fonction d'urgence
        try {
          const FallbackComponent = await window.___forceBigFiveLoad();
          if (FallbackComponent) {
            console.log('Composant chargé via la fonction de secours');
            setComponent(() => FallbackComponent);
            setIsLoaded(true);
          } else {
            throw new Error('Impossible de charger le composant même via la fonction de secours');
          }
        } catch (fallbackError) {
          console.error('Échec de toutes les tentatives de chargement:', fallbackError);
          
          // En dernier recours, utilisez le composant importé directement
          setComponent(() => DirectIntroBigFive);
          setIsLoaded(true);
        }
      }
    };

    loadComponent();
  }, []);

  if (!isLoaded) {
    return <AdaptiveLoader message="Chargement de l'introduction du test Big Five..." />;
  }

  return Component ? <Component /> : (
    <div className="error-fallback">
      <h2>Erreur de chargement</h2>
      <p>Impossible de charger l'introduction du test Big Five.</p>
      <button onClick={() => window.location.reload()}>Recharger la page</button>
    </div>
  );
};

/**
 * Composant principal de routage avec état de connexion
 */
const AppRoutes = () => {
  const { networkStatus, isLoading, getCurrentLoadingMessage } = useNetwork();
  const [loadingErrors, setLoadingErrors] = useState({});

  // Fonction pour gérer les erreurs de chargement
  const handleLoadError = (path, error) => {
    console.error(`Erreur de chargement pour la route ${path}:`, error);
    setLoadingErrors(prev => ({
      ...prev,
      [path]: { error, timestamp: Date.now() }
    }));
  };

  // Fonction pour réessayer le chargement d'une route
  const retryLoading = (path) => {
    console.log(`Tentative de rechargement de la route: ${path}`);
    setLoadingErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[path];
      return newErrors;
    });
    // Forcer un rechargement de la page
    window.location.href = path;
  };
  
  // Si l'utilisateur est hors ligne, afficher un message
  if (!networkStatus.online) {
    return (
      <div className="offline-message">
        <h2>Vous êtes actuellement hors ligne</h2>
        <p>Veuillez vérifier votre connexion internet pour accéder à l'application.</p>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && (
        <div className="global-loading-indicator">
          <AdaptiveLoader message={getCurrentLoadingMessage()} />
        </div>
      )}
      
      <Routes>
        {/* Page d'accueil */}
        <Route 
          path="/" 
          element={
            loadingErrors['/'] ? 
              <FallbackComponent 
                title="Erreur de chargement de la page d'accueil" 
                onRetry={() => retryLoading('/')} 
              /> : 
              <Home />
          } 
        />
        
        {/* Routes pour le test RIASEC */}
        <Route 
          path="/riasec" 
          element={
            loadingErrors['/riasec'] ? 
              <FallbackComponent 
                title="Erreur de chargement" 
                onRetry={() => retryLoading('/riasec')} 
              /> : 
              <ProtectedRoute>
                <IntroRiasec />
              </ProtectedRoute>
          } 
        />
        <Route 
          path="/riasec/test" 
          element={
            <ProtectedRoute>
              <AppRiasecTest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/riasec/results" 
          element={
            <ProtectedRoute>
              <ResultRiasec />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes pour le test Big Five */}
        <Route 
          path="/bigfive" 
          element={
            loadingErrors['/bigfive'] ? 
              <FallbackComponent 
                title="Erreur de chargement de l'introduction Big Five" 
                message="Le composant n'a pas pu être chargé. Cela peut être dû à un problème technique temporaire." 
                onRetry={() => retryLoading('/bigfive')} 
              /> : 
              <ProtectedRoute>
                <BigFiveIntroRoute />
              </ProtectedRoute>
          } 
        />
        <Route 
          path="/bigfive/test" 
          element={
            <ProtectedRoute>
              <AppBigFiveTest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bigfive/results" 
          element={
            <ProtectedRoute>
              <ResultBigFive />
            </ProtectedRoute>
          } 
        />
        
        {/* Page de résultat générique */}
        <Route 
          path="/resultat" 
          element={
            <ProtectedRoute>
              <Resultat />
            </ProtectedRoute>
          } 
        />
        
        {/* Route par défaut en cas d'URL non reconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 