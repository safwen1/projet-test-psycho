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

// Service de détection de compatibilité du navigateur
import { createBrowserCompatibilityReport } from './services/browserDetectionService';

// Vérifier les fonctionnalités essentielles du navigateur avant l'initialisation
const checkBrowserCompatibility = () => {
  try {
    // Créer un rapport de compatibilité
    const report = createBrowserCompatibilityReport();
    
    // Enregistrer les informations sur le navigateur pour le débogage
    console.info('[BrowserInfo]', report.browserInfo);
    
    // Si le navigateur n'est pas compatible, afficher un message d'erreur
    if (!report.essentialFeaturesSupported) {
      const missingFeatures = Object.entries(report.supportedFeatures)
        .filter(([_, supported]) => !supported)
        .map(([feature]) => feature)
        .join(', ');
      
      console.error(`[Compatibility] Fonctionnalités essentielles manquantes: ${missingFeatures}`);
      
      // Afficher un message d'erreur simple pour l'utilisateur
      document.body.innerHTML = `
        <div style="text-align: center; font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d32f2f;">Navigateur non compatible</h1>
          <p>Votre navigateur ne prend pas en charge les fonctionnalités nécessaires à cette application.</p>
          <p>Veuillez utiliser un navigateur plus récent comme <a href="https://www.google.com/chrome/">Chrome</a>, <a href="https://www.mozilla.org/firefox/new/">Firefox</a>, <a href="https://www.microsoft.com/edge">Edge</a> ou <a href="https://www.apple.com/safari/">Safari</a>.</p>
          <p>Navigateur détecté : ${report.browserInfo.browser} (${report.browserInfo.os})</p>
        </div>
      `;
      
      return false;
    }
    
    // Le navigateur est compatible, continuer l'initialisation
    return true;
  } catch (error) {
    console.error('[Compatibility] Erreur lors de la vérification de compatibilité:', error);
    // En cas d'erreur, continuer quand même l'initialisation
    return true;
  }
};

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

// Démarrer l'application de manière sécurisée
const startApp = () => {
  // Vérifier la compatibilité du navigateur
  if (!checkBrowserCompatibility()) {
    return;
  }
  
  // Précharger les modules en arrière-plan
  preloadModules();
  
  try {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    
    root.render(
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
  } catch (error) {
    console.error('Erreur fatale lors du démarrage de l\'application:', error);
    document.body.innerHTML = `
      <div style="text-align: center; font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d32f2f;">Erreur de démarrage</h1>
        <p>Une erreur est survenue lors du démarrage de l'application.</p>
        <p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
        <button 
          onclick="window.location.reload()" 
          style="padding: 10px 15px; background-color: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;"
        >
          Rafraîchir la page
        </button>
      </div>
    `;
  }
};

// Démarrer l'application
startApp();
