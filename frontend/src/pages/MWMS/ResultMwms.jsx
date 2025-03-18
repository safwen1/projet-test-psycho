import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MWMS_DIMENSIONS, MWMS_SUBDIMENSIONS } from '../../constants/MWMS/data';

const TestInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(51, 164, 116, 0.1);
  border-radius: 8px;
  color: #33A474;
  font-weight: 500;

  &::before {
    content: ${props => props.$icon};
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const MainScoreContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ScoreCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 5px solid ${props => props.$color};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: 1.2rem;
    max-width: 100%;
  }
`;

const ScoreTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.$color};
  margin: 0.5rem 0;
`;

const ScoreDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const ChartContainer = styled.div`
  margin: 3rem 0;
  height: 400px;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const AnalysisContainer = styled.div`
  margin: 2rem 0;
`;

const AnalysisTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const AnalysisText = styled.p`
  color: #444;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-line;
`;

const DetailedScoresContainer = styled.div`
  margin: 3rem 0;
`;

const DetailedScoreTitle = styled.h3`
  color: #333;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled(Button)`
  margin-top: 2rem !important;
  padding: 0.8rem 2rem !important;
  font-size: 1rem !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
  }
`;

const ResultMwms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, duration } = location.state || {};

  // Si aucun résultat n'est disponible, rediriger vers la page d'accueil
  if (!result) {
    navigate('/');
    return null;
  }

  // Formater le temps
  const formatTime = (duration) => {
    if (!duration) return 'N/A';
    return duration;
  };

  // Préparer les données pour le graphique radar
  const prepareRadarData = () => {
    return [
      {
        subject: 'Motivation autonome',
        score: result.scores.autonomousMotivation,
        fullMark: 7
      },
      {
        subject: 'Régulation introjectée',
        score: result.scores.introjectedRegulation,
        fullMark: 7
      },
      {
        subject: 'Régulation externe',
        score: result.scores.externalRegulation,
        fullMark: 7
      }
    ];
  };

  // Préparer les données pour le graphique en barres
  const prepareBarData = () => {
    return [
      {
        name: 'Motivation intrinsèque',
        value: result.dimensions.intrinsicMotivation,
        fill: '#2E7D32'
      },
      {
        name: 'Régulation identifiée',
        value: result.dimensions.identifiedRegulation,
        fill: '#388E3C'
      },
      {
        name: 'Régulation introjectée',
        value: result.dimensions.introjectedRegulation,
        fill: '#4298B4'
      },
      {
        name: 'Régulation externe sociale',
        value: result.dimensions.externalSocialRegulation,
        fill: '#7B1FA2'
      },
      {
        name: 'Régulation externe matérielle',
        value: result.dimensions.externalMaterialRegulation,
        fill: '#9C27B0'
      }
    ];
  };

  // Obtenir l'interprétation pour un score
  const getScoreInterpretation = (dimensionId, score) => {
    const dimension = MWMS_DIMENSIONS.find(d => d.id === dimensionId);
    if (!dimension) return '';
    
    if (score >= 5) {
      return dimension.highScore;
    } else if (score <= 3) {
      return dimension.lowScore;
    } else {
      return 'Score moyen';
    }
  };

  // Retourner à la page d'accueil
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 700 }}>
        Résultats du Test de Motivation au Travail (MWMS)
      </Typography>
      
      <TestInfo>
        <InfoItem $icon="'⏱️'">
          Durée : {formatTime(duration)}
        </InfoItem>
        <InfoItem $icon="'📊'">
          Test : Multidimensional Work Motivation Scale
        </InfoItem>
      </TestInfo>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}>
          Vos sources de motivation professionnelle
        </Typography>
        
        <MainScoreContainer>
          {MWMS_DIMENSIONS.map(dimension => (
            <ScoreCard key={dimension.id} $color={dimension.color}>
              <ScoreTitle>{dimension.label}</ScoreTitle>
              <ScoreValue $color={dimension.color}>
                {result.scores[dimension.id].toFixed(1)}
              </ScoreValue>
              <Typography variant="body2" color="text.secondary" align="center">
                sur 7
              </Typography>
              <ScoreDescription>
                {getScoreInterpretation(dimension.id, result.scores[dimension.id])}
              </ScoreDescription>
            </ScoreCard>
          ))}
        </MainScoreContainer>
        
        <ChartContainer>
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}>
            Profil de motivation
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareRadarData()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 7]} />
              <Radar name="Score" dataKey="score" stroke="#33A474" fill="#33A474" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <DetailedScoresContainer>
          <DetailedScoreTitle>Détail des sous-dimensions</DetailedScoreTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareBarData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 7]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </DetailedScoresContainer>
        
        {result.iaAnalysis && (
          <AnalysisContainer>
            <AnalysisTitle>Analyse personnalisée</AnalysisTitle>
            <AnalysisText>
              {result.iaAnalysis}
            </AnalysisText>
          </AnalysisContainer>
        )}
        
        <Accordion sx={{ mt: 4 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Comprendre vos résultats</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Le test MWMS (Multidimensional Work Motivation Scale) évalue vos sources de motivation professionnelle à travers trois dimensions principales :
            </Typography>
            
            {MWMS_DIMENSIONS.map(dimension => (
              <Box key={dimension.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: dimension.color }}>
                  {dimension.label}
                </Typography>
                <Typography variant="body2" paragraph>
                  {dimension.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Score élevé :</strong> {dimension.highScore}
                </Typography>
                <Typography variant="body2">
                  <strong>Score faible :</strong> {dimension.lowScore}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Sous-dimensions
            </Typography>
            
            {MWMS_SUBDIMENSIONS.map(subdimension => (
              <Box key={subdimension.id} sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: subdimension.color }}>
                  {subdimension.label}
                </Typography>
                <Typography variant="body2" paragraph>
                  {subdimension.description}
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <ActionButton 
            variant="contained" 
            color="primary" 
            onClick={handleBackToHome}
            sx={{ backgroundColor: '#33A474', '&:hover': { backgroundColor: '#2E7D32' } }}
          >
            Retour à l'accueil
          </ActionButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResultMwms; 