import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
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

const ResultContainer = styled(Container)`
  animation: ${fadeIn} 0.6s ease-out;
  padding: 2rem 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const StyledPaper = styled(Paper)`
  background: linear-gradient(135deg, #fff 0%, #fff8ef 100%);
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.1) !important;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.1);
  
  @media (max-width: 768px) {
    border-radius: 15px !important;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #ff9800 0%, #fb8c00 100%);
  padding: 2rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const ChartContainer = styled(Paper)`
  padding: 1.5rem;
  height: 300px;
  background: white;
  border-radius: 15px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(255, 152, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1rem;
    height: 250px;
    margin-bottom: 1rem;
  }

  @media print {
    height: 250px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const DimensionCard = styled(Paper)`
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 15px !important;
  border-left: 5px solid #ff9800;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ScoreChip = styled.div`
  background: ${props => `rgba(255, 152, 0, ${props.$score / 50})`};
  color: ${props => props.$score > 25 ? 'white' : '#333'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-weight: bold;
  margin-left: 1rem;
`;

const ActionButton = styled(Button)`
  background: ${props => props.$primary ? 'linear-gradient(135deg, #ff9800 0%, #fb8c00 100%)' : 'white'} !important;
  color: ${props => props.$primary ? 'white' : '#ff9800'} !important;
  border: ${props => props.$primary ? 'none' : '2px solid #ff9800'} !important;
  padding: 0.8rem 2rem !important;
  border-radius: 25px !important;
  font-weight: bold !important;
  text-transform: none !important;
  font-size: 1rem !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2) !important;
  }
`;

const DetailedResultsSection = styled.div`
  @media print {
    page-break-before: always;
    break-before: always;
  }
`;

const ButtonContainer = styled(Box)`
  @media print {
    display: none !important;
  }
`;

const dimensionDescriptions = {
  extraversion: {
    title: 'Extraversion',
    high: 'Vous êtes une personne sociable, énergique et à l\'aise dans les interactions professionnelles. Vous recherchez activement les échanges avec vos collègues et vous vous épanouissez dans les réunions et le travail d\'équipe.',
    medium: 'Vous maintenez un équilibre entre les moments d\'échange et de concentration individuelle au travail. Vous pouvez être à l\'aise en réunion tout en appréciant les tâches qui demandent de l\'autonomie.',
    low: 'Vous préférez les environnements de travail calmes et les interactions en petit comité. Vous êtes plus à l\'aise dans les tâches individuelles et puisez votre énergie dans des moments de réflexion personnelle.'
  },
  nevrosisme: {
    title: 'Névrosisme',
    high: 'Vous pouvez être sensible au stress professionnel et aux changements dans votre environnement de travail. Cette sensibilité peut vous rendre plus attentif(ve) aux détails mais aussi plus vulnérable face aux défis professionnels.',
    medium: 'Vous gérez généralement bien vos émotions au travail tout en restant sensible aux situations stressantes. Vous maintenez un équilibre émotionnel satisfaisant face aux défis professionnels.',
    low: 'Vous faites preuve d\'une grande stabilité émotionnelle et d\'une bonne résistance au stress professionnel. Vous restez calme et posé(e) même dans des situations de travail difficiles ou sous pression.'
  },
  agreabilite: {
    title: 'Agréabilité',
    high: 'Vous êtes une personne bienveillante et attentive aux besoins de vos collègues. Vous privilégiez l\'harmonie dans les relations professionnelles et faites preuve d\'une grande empathie dans votre environnement de travail.',
    medium: 'Vous savez équilibrer vos objectifs professionnels avec les besoins de votre équipe. Vous êtes capable de coopération tout en maintenant vos limites dans le cadre professionnel.',
    low: 'Vous êtes direct(e) et franc(he) dans vos interactions professionnelles. Vous privilégiez l\'efficacité et les résultats, ce qui peut parfois vous faire paraître distant(e) dans vos relations de travail.'
  },
  conscience: {
    title: 'Conscience professionnelle',
    high: 'Vous êtes très organisé(e) et méthodique dans votre approche du travail. Vous accordez une grande importance à la planification, à la rigueur et à l\'atteinte de vos objectifs professionnels.',
    medium: 'Vous savez être organisé(e) quand c\'est nécessaire tout en gardant une certaine flexibilité au travail. Vous équilibrez bien structure et adaptabilité dans vos missions.',
    low: 'Vous préférez une approche plus flexible et spontanée au travail. Vous pouvez être créatif(ve) mais parfois avoir du mal à suivre une organisation stricte ou des processus rigides.'
  },
  ouverture: {
    title: 'Ouverture à l\'expérience',
    high: 'Vous êtes curieux(se) intellectuellement et ouvert(e) aux innovations dans votre domaine professionnel. Vous appréciez les concepts abstraits et proposez régulièrement des idées nouvelles dans votre travail.',
    medium: 'Vous appréciez un mélange d\'innovation et de méthodes éprouvées. Vous êtes ouvert(e) aux nouvelles approches professionnelles tout en valorisant les pratiques qui ont fait leurs preuves.',
    low: 'Vous préférez les approches pratiques et concrètes dans votre travail. Vous appréciez la stabilité et les méthodes éprouvées, privilégiant l\'expérience et les faits aux concepts théoriques.'
  }
};

const getScoreLevel = (score) => {
  if (score <= 25) return 'low';
  if (score <= 35) return 'medium';
  return 'high';
};

const ResultBigFive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state;

  if (!results) {
    return (
      <ResultContainer maxWidth="md">
        <StyledPaper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Aucun résultat disponible
          </Typography>
          <ActionButton $primary onClick={() => navigate('/bigfive')}>
            Passer le test
          </ActionButton>
        </StyledPaper>
      </ResultContainer>
    );
  }

  const radarData = [
    { dimension: 'Extraversion', score: results.scores.extraversion },
    { dimension: 'Névrosisme', score: results.scores.nevrosisme },
    { dimension: 'Agréabilité', score: results.scores.agreabilite },
    { dimension: 'Conscience', score: results.scores.conscience },
    { dimension: 'Ouverture', score: results.scores.ouverture }
  ];

  const barData = Object.entries(results.scores).map(([key, value]) => ({
    name: dimensionDescriptions[key].title,
    score: value
  }));

  return (
    <ResultContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <HeaderSection>
          <Typography variant="h4" gutterBottom>
            Vos résultats du test de personnalité Big Five
          </Typography>
          <Typography variant="body1">
            Test complété le {new Date(results.completedAt).toLocaleDateString()} en {results.duration}
          </Typography>
        </HeaderSection>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ChartContainer elevation={0}>
                <Typography variant="h6" gutterBottom align="center" color="primary" sx={{ color: '#ff9800', fontSize: '1rem', mb: 1 }}>
                  Profil radar de personnalité
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#ff9800" />
                    <PolarAngleAxis dataKey="dimension" stroke="#666" />
                    <PolarRadiusAxis domain={[0, 50]} stroke="#666" />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#ff9800"
                      fill="#ff9800"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <ChartContainer elevation={0}>
                <Typography variant="h6" gutterBottom align="center" sx={{ color: '#ff9800', fontSize: '1rem', mb: 1 }}>
                  Scores par dimension
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={barData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 70
                    }}
                    barSize={30}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
                      stroke="#666"
                      interval={0}
                      tick={{
                        fontSize: 10,
                        dy: 10
                      }}
                    />
                    <YAxis 
                      domain={[0, 50]} 
                      stroke="#666"
                      tickCount={6}
                      width={30}
                      tick={{
                        fontSize: 10
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #ff9800',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                      formatter={(value) => [`${value}/50`, 'Score']}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="#ff9800" 
                      name="Score" 
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Grid>

            <Grid item xs={12} component={DetailedResultsSection}>
              <Typography variant="h5" gutterBottom sx={{ color: '#ff9800', mb: 3, mt: 2 }}>
                Interprétation détaillée de vos résultats
              </Typography>

              {Object.entries(results.scores).map(([dimension, score]) => (
                <DimensionCard key={dimension} elevation={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#ff9800' }}>
                      {dimensionDescriptions[dimension].title}
                    </Typography>
                    <ScoreChip $score={score}>
                      {score}/50
                    </ScoreChip>
                  </Box>
                  <Typography paragraph sx={{ color: '#555' }}>
                    {dimensionDescriptions[dimension][getScoreLevel(score)]}
                  </Typography>
                </DimensionCard>
              ))}
            </Grid>

            <Grid item xs={12}>
              <ButtonContainer sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 2 }}>
                <ActionButton onClick={() => window.print()}>
                  Imprimer les résultats
                </ActionButton>
                <ActionButton $primary onClick={() => navigate('/')}>
                  Retour à l'accueil
                </ActionButton>
              </ButtonContainer>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </ResultContainer>
  );
};

export default ResultBigFive; 