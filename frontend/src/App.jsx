import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Navbar from './components/Navbar/Navbar';
import { NetworkProvider } from './context/NetworkContext';
import { NavigationProvider } from './context/NavigationContext';
import { UserProvider } from './context/userContext';
import AppRoutes from './routes/index';
import AdaptiveLoader from './components/Loaders/AdaptiveLoader';
import BrowserCompatibilityAlert from './components/BrowserCompatibilityAlert';
import { initGlobalErrorHandler } from './services/errorHandlingService';

// Composant qui gère les erreurs de chargement via ErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur de l\'application:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Afficher un message d'erreur convivial
      return (
        <div className="error-boundary-app">
          <h2>Une erreur est survenue</h2>
          <p>{this.state.error?.message || 'Erreur inconnue'}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Détails techniques (pour le support)</summary>
            <p>{this.state.error?.toString()}</p>
            <p>{this.state.errorInfo?.componentStack}</p>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 15px',
              margin: '20px 0',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recharger l'application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  // Initialiser le gestionnaire global d'erreurs
  useEffect(() => {
    console.log('Application initialisée');
    // Initialiser le gestionnaire d'erreurs
    initGlobalErrorHandler();
  }, []);
  
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <NavigationProvider>
          <UserProvider>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              {/* Alerte de compatibilité navigateur - s'affiche uniquement si nécessaire */}
              <BrowserCompatibilityAlert />
              <Navbar />
              <React.Suspense 
                fallback={<AdaptiveLoader message="Chargement de l'application..." />}
              >
                <AppRoutes />
              </React.Suspense>
            </ThemeProvider>
          </UserProvider>
        </NavigationProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
};

export default App;
