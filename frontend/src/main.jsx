import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from "./App";
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { UserProvider } from "./context/userContext.jsx";

// Précharge les modules importants pour éviter les problèmes de lazy loading
const preloadModules = async () => {
  try {
    console.log('Préchargement des modules principaux...');
    
    // Préchargement des composants Big Five
    const introBigFive = await import('./pages/BigFive/IntroBigFive');
    const appBigFiveTest = await import('./pages/BigFive/AppBigFiveTest');
    const resultBigFive = await import('./pages/BigFive/ResultBigFive');
    
    // Préchargement des composants RIASEC
    const introRiasec = await import('./pages/RIASEC/IntroRiasec');
    const appRiasecTest = await import('./pages/RIASEC/AppRiasecTest');
    const resultRiasec = await import('./pages/RIASEC/ResultRiasec');
    
    console.log('Préchargement des modules terminé avec succès.');
    
    // Enregistre les modules dans une variable globale pour s'assurer qu'ils restent en mémoire
    window.__preloadedModules = {
      introBigFive,
      appBigFiveTest,
      resultBigFive,
      introRiasec,
      appRiasecTest,
      resultRiasec
    };
  } catch (error) {
    console.error('Erreur lors du préchargement des modules:', error);
  }
};

// Lance le préchargement en arrière-plan
preloadModules();

// Fonction pour régler les problèmes potentiels de chargement
window.___forceBigFiveLoad = async () => {
  try {
    const module = await import('./pages/BigFive/IntroBigFive');
    return module.default;
  } catch (error) {
    console.error('Erreur lors du chargement forcé:', error);
    return null;
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
