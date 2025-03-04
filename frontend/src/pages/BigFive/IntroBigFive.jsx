import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Switch, FormControlLabel } from '@mui/material';
import { Timer, Psychology, AccessTime, Help } from '@mui/icons-material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
  }
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  color: #ff9800;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Kanit', sans-serif;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #ff9800, #fb8c00);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 152, 0, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 152, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  svg {
    color: #ff9800;
    font-size: 2rem;
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  color: #ff9800;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const CardText = styled.p`
  color: #666;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const FooterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 152, 0, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 152, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const TimerSwitch = styled(FormControlLabel)`
  margin: 0 !important;
  
  .MuiSwitch-root {
    .MuiSwitch-track {
      background-color: rgba(255, 152, 0, 0.3) !important;
    }
    
    .MuiSwitch-thumb {
      background-color: #ff9800;
    }
    
    &.Mui-checked {
      .MuiSwitch-track {
        background-color: rgba(255, 152, 0, 0.6) !important;
      }
    }
  }
  
  .MuiFormControlLabel-label {
    color: #666;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #ff9800 0%, #fb8c00 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const IntroBigFive = () => {
  const navigate = useNavigate();
  const [showTimer, setShowTimer] = useState(true);

  const handleStartTest = () => {
    navigate('/bigfive/test', { state: { showTimer } });
  };

  return (
    <PageContainer>
      <Container>
        <StyledTitle>Test de personnalité Big Five en contexte professionnel</StyledTitle>
        
        <InfoGrid>
          <InfoCard>
            <Psychology />
            <CardContent>
              <CardTitle>Découvrez votre personnalité au travail</CardTitle>
              <CardText>
                Explorez les cinq dimensions fondamentales de votre personnalité dans un contexte professionnel : 
                Extraversion, Névrosisme, Agréabilité, Conscience et Ouverture.
              </CardText>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <AccessTime />
            <CardContent>
              <CardTitle>Durée du test</CardTitle>
              <CardText>
                Le test comprend 50 questions orientées vers le milieu professionnel et prend environ 10-15 minutes à compléter.
                Prenez votre temps pour répondre honnêtement.
              </CardText>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <Help />
            <CardContent>
              <CardTitle>Comment répondre</CardTitle>
              <CardText>
                Pour chaque affirmation concernant votre comportement au travail, indiquez votre degré d'accord sur une échelle de 1 à 5.
                Il n'y a pas de bonnes ou mauvaises réponses.
              </CardText>
            </CardContent>
          </InfoCard>

          <InfoCard>
            <Psychology />
            <CardContent>
              <CardTitle>Résultats détaillés</CardTitle>
              <CardText>
                Obtenez une analyse approfondie de votre profil de personnalité en milieu professionnel
                avec des explications détaillées pour chaque dimension.
              </CardText>
            </CardContent>
          </InfoCard>
        </InfoGrid>

        <FooterBar>
          <TimerSwitch
            control={
              <Switch
                checked={showTimer}
                onChange={(e) => setShowTimer(e.target.checked)}
              />
            }
            label={
              <span>
                Afficher le chronomètre pendant le test
              </span>
            }
          />
          <StartButton onClick={handleStartTest}>
            Commencer le test
          </StartButton>
        </FooterBar>
      </Container>
    </PageContainer>
  );
};

export default IntroBigFive; 