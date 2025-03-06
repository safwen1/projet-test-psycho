import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createBrowserCompatibilityReport, detectBrowser, isFeatureSupported } from '../services/browserDetectionService';

// Styles
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2a5885;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const BrowserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const BrowserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const BrowserIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
`;

const BrowserName = styled.h3`
  font-size: 1.1rem;
  margin: 5px 0;
  text-align: center;
`;

const DownloadButton = styled.a`
  margin-top: 10px;
  background-color: #4285f4;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  text-align: center;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const YourBrowserInfo = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureName = styled.span`
  font-weight: 500;
`;

const StatusIcon = styled.span`
  color: ${props => props.supported ? '#4caf50' : '#f44336'};
`;

const CompatibilityScore = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 20px 0;
`;

const ScoreValue = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => {
    if (props.score >= 90) return '#4caf50';
    if (props.score >= 70) return '#ff9800';
    return '#f44336';
  }};
  margin: 0 5px;
`;

/**
 * Page d'information sur la compatibilité des navigateurs
 */
const CompatibilityInfoPage = () => {
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    try {
      const compatibilityReport = createBrowserCompatibilityReport();
      setReport(compatibilityReport);
    } catch (error) {
      console.error('Erreur lors de la création du rapport de compatibilité:', error);
    }
  }, []);
  
  // Définir les navigateurs recommandés
  const recommendedBrowsers = [
    {
      name: 'Google Chrome',
      icon: 'https://www.google.com/chrome/static/images/chrome-logo.svg',
      downloadUrl: 'https://www.google.com/chrome/',
    },
    {
      name: 'Mozilla Firefox',
      icon: 'https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg',
      downloadUrl: 'https://www.mozilla.org/firefox/new/',
    },
    {
      name: 'Microsoft Edge',
      icon: 'https://edgefrecdn.azureedge.net/insider-static/icons/edge-insider-contrast-lockup.svg',
      downloadUrl: 'https://www.microsoft.com/edge',
    },
    {
      name: 'Safari',
      icon: 'https://www.apple.com/v/safari/compare/a/images/overview/icon_safari__dvxkhtd9a76q_large.png',
      downloadUrl: 'https://www.apple.com/safari/',
    },
  ];
  
  // Définir les fonctionnalités testées
  const features = [
    { name: 'LocalStorage', key: 'localstorage', description: 'Stockage local des données' },
    { name: 'Flexbox CSS', key: 'flexbox', description: 'Mise en page flexible' },
    { name: 'Fetch API', key: 'fetch', description: 'Requêtes réseau modernes' },
    { name: 'Promise.all', key: 'promiseAll', description: 'Gestion de promesses multiples' },
    { name: 'Async/Await', key: 'asyncAwait', description: 'Asynchronicité moderne' },
    { name: 'WebP Images', key: 'webp', description: 'Format d\'image optimisé' },
    { name: 'Service Worker', key: 'serviceWorker', description: 'Fonctionnalités hors ligne' },
  ];
  
  if (!report) {
    return (
      <Container>
        <Title>Analyse de compatibilité en cours...</Title>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>Compatibilité de votre navigateur</Title>
      
      <Section>
        <SectionTitle>Votre navigateur</SectionTitle>
        <YourBrowserInfo>
          <p>
            <strong>Navigateur :</strong> {report.browserInfo.browser} 
            <br />
            <strong>Système d'exploitation :</strong> {report.browserInfo.os}
            <br />
            <strong>Type d'appareil :</strong> {report.browserInfo.device}
          </p>
          
          <CompatibilityScore>
            Score de compatibilité : <ScoreValue score={report.compatibilityScore.toFixed(0)}>
              {report.compatibilityScore.toFixed(0)}%
            </ScoreValue>
          </CompatibilityScore>
        </YourBrowserInfo>
      </Section>
      
      <Section>
        <SectionTitle>Support des fonctionnalités</SectionTitle>
        {features.map(feature => (
          <StatusRow key={feature.key}>
            <div>
              <FeatureName>{feature.name}</FeatureName>
              <p style={{ margin: '3px 0 0', fontSize: '0.9rem', color: '#777' }}>{feature.description}</p>
            </div>
            <StatusIcon supported={report.supportedFeatures[feature.key]}>
              {report.supportedFeatures[feature.key] ? '✓ Supporté' : '✕ Non supporté'}
            </StatusIcon>
          </StatusRow>
        ))}
      </Section>
      
      <Section>
        <SectionTitle>Navigateurs recommandés</SectionTitle>
        <p>Pour une expérience optimale, nous vous recommandons d'utiliser l'un des navigateurs suivants :</p>
        
        <BrowserGrid>
          {recommendedBrowsers.map(browser => (
            <BrowserCard key={browser.name}>
              <BrowserIcon src={browser.icon} alt={browser.name} />
              <BrowserName>{browser.name}</BrowserName>
              <DownloadButton href={browser.downloadUrl} target="_blank" rel="noopener noreferrer">
                Télécharger
              </DownloadButton>
            </BrowserCard>
          ))}
        </BrowserGrid>
      </Section>
      
      <Section>
        <SectionTitle>Pourquoi la compatibilité est importante</SectionTitle>
        <p>
          Notre application utilise des technologies web modernes pour vous offrir une expérience 
          fluide et interactive. Certains navigateurs plus anciens ne prennent pas en charge 
          ces fonctionnalités, ce qui peut entraîner des problèmes d'affichage ou de fonctionnement.
        </p>
        <p>
          En utilisant un navigateur moderne et à jour, vous bénéficiez non seulement d'une 
          meilleure expérience utilisateur, mais aussi d'une sécurité renforcée et de meilleures 
          performances.
        </p>
      </Section>
    </Container>
  );
};

export default CompatibilityInfoPage; 