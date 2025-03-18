import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import senseiStyle from '../../images/style-sensei.png';
import { Switch, FormControlLabel } from '@mui/material';

const PageContainer = styled.div`
  background-color: #e8f5e9;
  min-height: calc(100vh - 70px);
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  margin-top: 0;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  background-color: white;
  border: 1px solid #000;
  border-radius: 50px;
  width: 90%;
  margin: 30px auto;
  position: relative;

  @media (max-width: 1024px) {
    padding: 30px;
    width: 95%;
  }

  @media (max-width: 768px) {
    padding: 25px;
    border-radius: 30px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 20px;
    margin: 15px auto;
  }
`;

const LeftSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const StyledTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, #33A474 0%, #2E7D32 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: auto;
  display: inline-block;

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 1rem;
    width: 100%;
  }

  &:hover {
    background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const SenseiImage = styled.img`
  position: absolute;
  right: 100px;
  top: 30px;
  width: 100px;
  height: auto;

  @media (max-width: 1024px) {
    width: 80px;
    right: 70px;
  }

  @media (max-width: 768px) {
    width: 60px;
    right: 20px;
    top: 20px;
  }

  @media (max-width: 480px) {
    width: 50px;
    right: 10px;
    top: 10px;
  }
`;

const FooterBar = styled.div`
  background-color: black;
  height: 30px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
`;

const TimerSwitch = styled(FormControlLabel)`
  margin-top: 20px;
  margin-bottom: 20px;
  .MuiSwitch-track {
    background-color: #33A474 !important;
  }
  .MuiSwitch-switchBase.Mui-checked {
    color: #33A474 !important;
  }
`;

const IntroMwms = () => {
  const navigate = useNavigate();
  const [showTimer, setShowTimer] = useState(true);

  const handleStartTest = () => {
    navigate('/mwms/test', { state: { showTimer } });
  };

  return (
    <PageContainer>
      <Container>
        <LeftSection>
          <StyledTitle>Test de Motivation au Travail (MWMS)</StyledTitle>
          <Description>
            Le test de Motivation au Travail (MWMS - Multidimensional Work Motivation Scale) évalue vos sources de motivation professionnelle à travers trois dimensions principales :
            <br/><br/>
            • Motivation autonome : Engagement par plaisir et alignement avec vos valeurs
            <br/>
            • Régulation introjectée : Motivation par l'évitement de sentiments négatifs
            <br/>
            • Régulation externe : Motivation par des facteurs externes (reconnaissance, salaire)
            <br/><br/>
            Structure du test :
            <br/>
            Le test comprend 13 affirmations pour lesquelles vous devrez indiquer dans quelle mesure chacune représente vos raisons de fournir des efforts dans votre travail.
            <br/><br/>
            Système de notation :
            <br/>
            Pour chaque affirmation, vous répondrez sur une échelle de 1 à 7 :
            <br/><br/>
            1️⃣ Pas du tout pour cette raison
            <br/>
            2️⃣ Un peu pour cette raison
            <br/>
            3️⃣ Plutôt pour cette raison
            <br/>
            4️⃣ Moyennement pour cette raison
            <br/>
            5️⃣ En grande partie pour cette raison
            <br/>
            6️⃣ Beaucoup pour cette raison
            <br/>
            7️⃣ Tout à fait pour cette raison
            <br/><br/>
            Ce questionnaire a pour objectif d'identifier vos sources de motivation professionnelle dominantes. Il repose sur des recherches en psychologie du travail et ne comporte pas de bonnes ou mauvaises réponses. Répondez spontanément en fonction de ce qui vous correspond réellement. Vos réponses seront analysées pour vous proposer un profil personnalisé. La passation dure environ 10 à 15 minutes.
            <br/><br/>
            Conseils :
            <br/>
            • Répondez de manière spontanée et honnête
            <br/>
            • Il n'y a pas de bonnes ou mauvaises réponses
            <br/>
            • Basez-vous sur votre expérience professionnelle actuelle ou récente
            <br/>
            • Prenez le temps de bien lire chaque proposition
          </Description>
          <Description style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
            ℹ️ Note : Le timer est uniquement indicatif et n'a aucune incidence sur le test. Vous pouvez l'afficher ou le masquer à tout moment en cliquant dessus pendant le test.
          </Description>
          <TimerSwitch
            control={
              <Switch
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
                color="primary"
              />
            }
            label="Afficher le timer pendant le test"
          />
          <StartButton onClick={handleStartTest}>
            Commencer le test
          </StartButton>
        </LeftSection>
        <SenseiImage src={senseiStyle} alt="Style Sensei" />
      </Container>
      <FooterBar />
    </PageContainer>
  );
};

export default IntroMwms; 