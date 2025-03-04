import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import styled from 'styled-components';
import { Button, Typography, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
`;

const ErrorCard = styled(Paper)`
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled(ErrorOutlineIcon)`
  font-size: 4rem;
  color: #f44336;
  margin-bottom: 1.5rem;
`;

const ProtectedRoute = ({ children }) => {
  const { userId, mail_consultant } = useUserContext();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  const isAuthenticated = userId && mail_consultant;

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    if (countdown <= 0) {
      return <Navigate to="/" replace />;
    }

    return (
      <ErrorContainer>
        <ErrorCard elevation={3}>
          <ErrorIcon />
          <Typography variant="h4" gutterBottom>
            Accès non autorisé
          </Typography>
          <Typography variant="body1" paragraph>
            Vous devez être identifié pour accéder à cette page. Veuillez contacter votre consultant pour obtenir un lien d'accès valide.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Vous serez redirigé vers la page d'accueil dans {countdown} seconde{countdown !== 1 ? 's' : ''}.
          </Typography>
          <Box mt={3}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </Button>
          </Box>
        </ErrorCard>
      </ErrorContainer>
    );
  }

  return children;
};

export default ProtectedRoute; 