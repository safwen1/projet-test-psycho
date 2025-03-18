import React, { Suspense, lazy, useState, useEffect } from 'react';
import AdaptiveLoader from '../Loaders/AdaptiveLoader';
import { useNetwork } from '../../context/NetworkContext';

/**
 * HOC (Higher-Order Component) qui implémente le chargement paresseux pour les composants
 * @param {Function} importComponent - Fonction qui retourne une promesse d'import de composant
 * @param {Object} options - Options pour le chargement paresseux
 * @param {string} options.fallback - Message de chargement à afficher
 * @param {Function} options.onError - Fonction de gestion des erreurs
 * @returns {React.ComponentType} - Composant avec chargement paresseux
 */
export const withLazyLoading = (importComponent, options = {}) => {
  // Options par défaut
  const {
    fallback = "Chargement en cours...",
    onError = (error) => console.error("Erreur de chargement du composant:", error),
    timeout = 15000, // Timeout en ms (15 secondes par défaut)
  } = options;

  // Création du composant avec chargement paresseux et gestion d'erreur améliorée
  const LazyComponent = lazy(() => {
    // Ajout d'un timeout pour détecter les chargements bloqués
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout: Le chargement du composant a pris plus de ${timeout/1000}s`));
      }, timeout);
    });

    // Course entre le chargement du composant et le timeout
    return Promise.race([
      importComponent().catch(error => {
        onError(error);
        console.error('Erreur lors du chargement du composant:', error.message);
        // Renvoie un module par défaut pour éviter de planter l'application
        return { 
          default: () => (
            <div className="error-boundary">
              <h3>Erreur de chargement</h3>
              <p>Impossible de charger le composant: {error.message}</p>
              <button onClick={() => window.location.reload()}>Recharger la page</button>
            </div>
          ) 
        };
      }),
      timeoutPromise
    ]).catch(error => {
      onError(error);
      console.error('Erreur de chargement (timeout):', error.message);
      return { 
        default: () => (
          <div className="error-boundary">
            <h3>Chargement trop long</h3>
            <p>Le chargement du composant a pris trop de temps</p>
            <button onClick={() => window.location.reload()}>Recharger la page</button>
          </div>
        ) 
      };
    });
  });

  // Wrapper autour du composant lazy
  const WithLazyLoading = (props) => {
    const { interfaceQuality } = useNetwork();
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    // En cas d'erreur pendant le rendu
    useEffect(() => {
      // Remet l'erreur à zéro quand les props changent
      setHasError(false);
      setError(null);
    }, [props]);

    // Si la qualité d'interface est basse, on peut afficher une version simplifiée
    const SimplifiedComponent = () => (
      <div className="simplified-component">
        <h3>{options.title || "Contenu"}</h3>
        <p>{options.description || "Chargement du contenu complet..."}</p>
      </div>
    );

    // Gestionnaire d'erreur pour Suspense
    const handleError = (error) => {
      console.error('Erreur pendant le rendu:', error);
      setHasError(true);
      setError(error);
      onError(error);
    };

    // En cas d'erreur, affiche un message d'erreur
    if (hasError) {
      return (
        <div className="error-boundary">
          <h3>Erreur de rendu</h3>
          <p>Une erreur s'est produite lors de l'affichage: {error?.message}</p>
          <button onClick={() => window.location.reload()}>Recharger la page</button>
        </div>
      );
    }

    return (
      // On utilise un try/catch via ErrorBoundary
      <React.Fragment>
        <Suspense fallback={<AdaptiveLoader message={fallback} />}>
          {interfaceQuality === 'low' && options.simplified ? (
            <SimplifiedComponent />
          ) : (
            <React.Fragment>
              <LazyComponent {...props} />
            </React.Fragment>
          )}
        </Suspense>
      </React.Fragment>
    );
  };

  return WithLazyLoading;
};

/**
 * Fonction utilitaire pour créer facilement des routes avec chargement paresseux
 * @param {string} componentPath - Chemin vers le composant à charger
 * @param {Object} options - Options pour le chargement paresseux
 * @returns {React.ComponentType} - Composant de route avec chargement paresseux
 * 
 * @deprecated Utiliser createLazyComponent à la place pour une meilleure compatibilité avec Vite
 */
export const lazyRoute = (componentPath, options = {}) => {
  console.log(`Configuration du chargement paresseux pour: ${componentPath}`);
  console.warn(`
    ⚠️ DÉPRÉCIÉ: La fonction lazyRoute est dépréciée et peut causer des avertissements avec Vite.
    Utilisez plutôt createLazyComponent pour une meilleure compatibilité.
    Exemple: const LazyComponent = createLazyComponent('ComponentName', () => import('./path/to/Component.jsx'));
  `);
  
  return withLazyLoading(
    () => {
      console.log(`Chargement du composant: ${componentPath}`);
      
      // Utilisation de @vite-ignore pour supprimer l'avertissement
      // Note: nous avons également configuré Vite pour ignorer ces avertissements
      return import(/* @vite-ignore */ `../../${componentPath}`)
        .then(module => {
          console.log(`Composant chargé avec succès: ${componentPath}`);
          return module;
        })
        .catch(error => {
          console.error(`Erreur de chargement pour ${componentPath}:`, error);
          throw error;
        });
    },
    {
      fallback: options.fallback || `Chargement de la page...`,
      timeout: options.timeout || 15000,
      ...options
    }
  );
};

/**
 * Fonction utilitaire pour créer facilement des composants avec chargement paresseux
 * Cette fonction est plus flexible que lazyRoute car elle permet de spécifier un chemin absolu
 * @param {string} componentPath - Chemin vers le composant à charger (relatif ou absolu)
 * @param {Object} options - Options pour le chargement paresseux
 * @returns {React.ComponentType} - Composant avec chargement paresseux
 * 
 * @deprecated Utiliser createLazyComponent à la place pour une meilleure compatibilité avec Vite
 */
export const lazyComponent = (componentPath, options = {}) => {
  console.warn(`
    ⚠️ DÉPRÉCIÉ: La fonction lazyComponent est dépréciée et peut causer des avertissements avec Vite.
    Utilisez plutôt createLazyComponent pour une meilleure compatibilité.
    Exemple: const LazyComponent = createLazyComponent('ComponentName', () => import('./path/to/Component.jsx'));
  `);
  
  const isAbsolutePath = componentPath.startsWith('/') || 
                         componentPath.startsWith('./') || 
                         componentPath.startsWith('../');
  
  return withLazyLoading(
    () => {
      console.log(`Chargement du composant: ${componentPath}`);
      
      // Si le chemin est absolu, on l'utilise tel quel, sinon on ajoute le préfixe ../../
      const importPath = isAbsolutePath 
        ? componentPath 
        : `../../${componentPath}`;
      
      // Utilisation de @vite-ignore pour supprimer l'avertissement
      return import(/* @vite-ignore */ importPath)
        .then(module => {
          console.log(`Composant chargé avec succès: ${componentPath}`);
          return module;
        })
        .catch(error => {
          console.error(`Erreur de chargement pour ${componentPath}:`, error);
          throw error;
        });
    },
    {
      fallback: options.fallback || `Chargement du composant...`,
      ...options
    }
  );
};

/**
 * Crée un composant avec chargement paresseux à partir d'un chemin de composant
 * Cette fonction est une alternative à lazyComponent qui utilise une approche plus compatible avec Vite
 * @param {string} componentName - Nom du composant à charger (utilisé pour la journalisation)
 * @param {Function} importFn - Fonction d'importation du composant (doit retourner une promesse)
 * @param {Object} options - Options pour le chargement paresseux
 * @returns {React.ComponentType} - Composant avec chargement paresseux
 */
export const createLazyComponent = (componentName, importFn, options = {}) => {
  return withLazyLoading(
    () => {
      console.log(`Chargement du composant: ${componentName}`);
      return importFn()
        .then(module => {
          console.log(`Composant chargé avec succès: ${componentName}`);
          return module;
        })
        .catch(error => {
          console.error(`Erreur de chargement pour ${componentName}:`, error);
          throw error;
        });
    },
    {
      fallback: options.fallback || `Chargement du composant...`,
      ...options
    }
  );
};

// Exemples d'utilisation de createLazyComponent:
// 
// Pour les pages:
// const LazyHome = createLazyComponent('Home', () => import('../../pages/Home/Home.jsx'));
// const LazyAbout = createLazyComponent('About', () => import('../../pages/About/About.jsx'));
//
// Pour les composants:
// const LazyDataTable = createLazyComponent('DataTable', () => import('../../components/DataTable/DataTable.jsx'));
//
// Utilisation dans les routes:
// <Route path="/" element={<LazyHome />} />
// <Route path="/about" element={<LazyAbout />} />

export default withLazyLoading; 