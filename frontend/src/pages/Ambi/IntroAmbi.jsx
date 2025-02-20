import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import userImage from '../../images/homepageImage.png';
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
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
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
    background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const UserImage = styled.img`
  position: absolute;
  right: 50px;
  bottom: 110px;
  transform: rotate(15deg);
  max-width: 300px;
  height: auto;

  @media (max-width: 1200px) {
    max-width: 250px;
    right: 30px;
    bottom: 90px;
  }

  @media (max-width: 1024px) {
    max-width: 200px;
    right: 20px;
    bottom: 70px;
  }

  @media (max-width: 768px) {
    display: none;
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
    background-color: #4caf50 !important;
  }
  .MuiSwitch-switchBase.Mui-checked {
    color: #4caf50 !important;
  }
`;

const IntroAmbi = () => {
  const navigate = useNavigate();
  const [showTimer, setShowTimer] = useState(true);

  const handleStartTest = () => {
    navigate('/ambi/test', { state: { showTimer } });
  };

  return (
    <PageContainer>
      <Container>
        <LeftSection>
          <StyledTitle>Test de Personnalité AMBI</StyledTitle>
          <Description>
            Le test AMBI est un test de personnalité approfondi qui évalue cinq dimensions fondamentales :
            <br/><br/>
            • Extraversion : Sociabilité, énergie et expressivité
            <br/>
            • Agréabilité : Empathie, coopération et bienveillance
            <br/>
            • Conscience : Organisation, discipline et fiabilité
            <br/>
            • Stabilité Émotionnelle : Gestion du stress et des émotions
            <br/>
            • Ouverture à l'Expérience : Curiosité, créativité et goût pour la nouveauté
            <br/><br/>
            Pour chaque affirmation, vous devrez indiquer votre niveau d'accord sur une échelle de 1 à 7 :
            <br/><br/>
            1 = Tout à fait en désaccord
            <br/>
            2 = En désaccord
            <br/>
            3 = Plutôt en désaccord
            <br/>
            4 = Neutre
            <br/>
            5 = Plutôt d'accord
            <br/>
            6 = D'accord
            <br/>
            7 = Tout à fait d'accord
            <br/><br/>
            Durée moyenne : 30-40 minutes pour 181 questions. Prenez votre temps pour répondre de manière réfléchie et honnête.
            <br/><br/>
            À la fin du test, vous recevrez une analyse détaillée de votre profil de personnalité AMBI.
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
        <UserImage src={userImage} alt="Illustration" />
        <SenseiImage src={senseiStyle} alt="Illustration" />
      </Container>
      <FooterBar />
    </PageContainer>
  );
};

export default IntroAmbi; 