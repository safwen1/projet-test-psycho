import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Navbar from './components/Navbar/Navbar';
import { NetworkProvider } from './context/NetworkContext';
import AppRoutes from './routes/index';
import AdaptiveLoader from './components/Loaders/AdaptiveLoader';

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
      return (
        <div className="error-boundary-app">
          <h2>Une erreur est survenue</h2>
          <p>{this.state.error?.message || 'Erreur inconnue'}</p>
          <button onClick={() => window.location.reload()}>Recharger l'application</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  // Ajout d'un log pour confirmer que l'application démarre correctement
  useEffect(() => {
    console.log('Application initialisée');
  }, []);
  
  return (
    <ErrorBoundary>
      <NetworkProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Navbar />
          <React.Suspense 
            fallback={<AdaptiveLoader message="Chargement de l'application..." />}
          >
            <AppRoutes />
          </React.Suspense>
        </ThemeProvider>
      </NetworkProvider>
    </ErrorBoundary>
  );
};

export default App;
