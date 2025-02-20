import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import userImage from '../../images/homepageImage.png';
import senseiStyle from '../../images/style-sensei.png';
import { Switch, FormControlLabel } from '@mui/material';

const PageContainer = styled.div`
  background-color: #e3f2fd;
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
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
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
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
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

const Section = styled.div`
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const SectionTitle = styled.h2`
  color: #2196f3;
  font-size: 1.5rem;
  margin: 20px 0 10px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin: 15px 0 8px;
  }
`;

const List = styled.ul`
  margin: 10px 0;
  padding-left: 20px;

  @media (max-width: 480px) {
    margin: 8px 0;
    padding-left: 15px;
  }
`;

const ListItem = styled.li`
  margin: 5px 0;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 4px 0;
  }
`;

const TimerSwitch = styled(FormControlLabel)`
  margin-top: 20px;
  margin-bottom: 20px;
  .MuiSwitch-track {
    background-color: #2196f3 !important;
  }
  .MuiSwitch-switchBase.Mui-checked {
    color: #2196f3 !important;
  }
`;

const IntroGcbs = () => {
  const navigate = useNavigate();
  const [showTimer, setShowTimer] = useState(true);

  const handleStartTest = () => {
    navigate('/gcbs/test', { state: { showTimer } });
  };

  return (
    <PageContainer>
      <Container>
        <LeftSection>
          <StyledTitle>Test de Style Cognitif et Décisionnel (GCBS)</StyledTitle>
          
          <Description>
            Ce test complet évalue vos préférences dans la prise de décision et votre style cognitif à travers plusieurs dimensions.
          </Description>

          <Section>
            <SectionTitle>Structure du Test</SectionTitle>
            <List>
              <ListItem>Partie I : Test principal GCBS (30 questions)</ListItem>
              <ListItem>Partie II : Enquête de personnalité TIPI (10 questions)</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>Dimensions Évaluées</SectionTitle>
            <List>
              <ListItem>RA : Raisonnement Analytique</ListItem>
              <ListItem>LP : Logique Pratique</ListItem>
              <ListItem>MF : Mode de Fonctionnement</ListItem>
              <ListItem>V : Validation</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>Durée et Instructions</SectionTitle>
            <Description>
              Durée moyenne : 10-15 minutes
              <br/><br/>
              Pour chaque question du test principal, vous devrez indiquer votre préférence entre deux options sur une échelle de 1 à 5.
              Pour l'enquête de personnalité, vous évaluerez des affirmations sur une échelle de 1 à 7.
              <br/><br/>
              Répondez de manière spontanée et honnête. Il n'y a pas de bonnes ou mauvaises réponses.
            </Description>
            <Description style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
              ℹ️ Note : Le timer est uniquement indicatif et n'a aucune incidence sur le test. Vous pouvez l'afficher ou le masquer à tout moment en cliquant dessus pendant le test.
            </Description>
          </Section>

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

export default IntroGcbs; 