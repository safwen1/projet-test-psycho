import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { theme } from '../../styles/theme';

// Animation d'entrée
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

// Animation pour l'icône de succès
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const ResultatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
`;

const ResultatCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.6s ease-out;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem;
    max-width: 95%;
  }
`;

const SuccessIcon = styled(CheckCircleOutlineIcon)`
  font-size: 6rem;
  color: ${theme.colors.success};
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const Title = styled(Typography)`
  font-family: 'Kanit', sans-serif;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${theme.colors.text};
`;

const Message = styled(Typography)`
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
  color: ${theme.colors.textLight};
  line-height: 1.6;
  max-width: 600px;
`;

const HomeButton = styled(Button)`
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Resultat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll vers le haut de la page
    window.scrollTo(0, 0);
  }, []);

  const handleRetourAccueil = () => {
    navigate('/');
  };

  return (
    <ResultatContainer>
      <ResultatCard elevation={3}>
        <SuccessIcon />
        <Title variant="h4">
          Félicitations !
        </Title>
        <Message variant="body1">
          Vous avez réussi votre test avec succès ! Vous débrieferez des résultats avec votre consultant lors du prochain rendez-vous.
        </Message>
        <Box mt={3}>
          <HomeButton 
            variant="contained" 
            color="primary" 
            onClick={handleRetourAccueil}
            disableElevation
          >
            Retour à l'accueil
          </HomeButton>
        </Box>
      </ResultatCard>
    </ResultatContainer>
  );
};

export default Resultat; 