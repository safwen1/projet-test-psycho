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
  Divider
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
import { RIASEC_THEMES, RIASEC_LETTERS } from '../../constants/RIASEC/data';

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
  background: rgba(156, 39, 176, 0.1);
  border-radius: 8px;
  color: #9c27b0;
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

const PredominantLetters = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const LetterBadge = styled.div`
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const ThemeScores = styled.div`
  margin: 2rem 0;
`;

const ThemeTitle = styled.h3`
  color: #333;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e1bee7;
`;

const LetterScores = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ScoreCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;

  .letter {
    font-weight: bold;
    color: #9c27b0;
    font-size: 1.2rem;
  }

  .score {
    font-size: 1.1rem;
    color: #666;
  }

  .progress {
    flex-grow: 1;
    height: 8px;
    background: #e1bee7;
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: ${props => (props.$score / 5) * 100}%;
      background: #9c27b0;
      border-radius: 4px;
    }
  }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%);
  min-height: 100vh;
  padding: 2rem 0;
`;

const HeaderSection = styled.div`
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Title = styled.h1`
  color: #2d3436;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
    
    &::after {
      width: 80px;
      height: 3px;
    }
  }
`;

const Description = styled.div`
  max-width: 800px;
  margin: 2rem auto 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  
  p {
    margin: 0.5rem 0;
  }

  .highlight {
    color: #9c27b0;
    font-weight: 500;
  }

  .themes {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .theme-tag {
    background: rgba(156, 39, 176, 0.1);
    color: #9c27b0;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
    
    .theme-tag {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
  }
`;

const ScoresSection = styled.div`
  // Add any necessary styles for the scores section
`;

const SectionTitle = styled.h2`
  // Add any necessary styles for the section title
`;

const DetailedScoresSection = styled.div`
  // Add any necessary styles for the detailed scores section
`;

const ScoreBar = styled.div`
  // Add any necessary styles for the score bar
`;

const ScoreLabel = styled.span`
  // Add any necessary styles for the score label
`;

const ProgressBarContainer = styled.div`
  // Add any necessary styles for the progress bar container
`;

const ProgressBar = styled.div`
  // Add any necessary styles for the progress bar
`;

const ScoreTable = styled(Paper)`
  margin-top: 2rem;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  color: white;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
`;

const TableContent = styled.div`
  padding: 1.5rem;
`;

const ThemeRow = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(6, 1fr);
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 150px repeat(6, 1fr);
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 120px repeat(6, 1fr);
    font-size: 0.8rem;
    padding: 0.8rem;
  }
`;

const ThemeLabel = styled.div`
  font-weight: 600;
  color: #333;
`;

const ScoreCell = styled.div`
  text-align: center;
  font-weight: ${props => props.$isTotal ? '600' : '400'};
  color: ${props => props.$isTotal ? '#9c27b0' : '#666'};
  background: ${props => props.$isTotal ? 'rgba(156, 39, 176, 0.1)' : 'transparent'};
  padding: 0.5rem;
  border-radius: 4px;
`;

const ResultRiasec = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, duration } = location.state || {};

  if (!result || !result.scores) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Résultats non disponibles
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Container>
    );
  }

  const formatTime = (duration) => {
    if (!duration) return "0m 0s";
    return duration;
  };

  // Score maximum pour le graphique radar (60 = 15 points × 4 thèmes)
  const maxScore = 60;

  return (
    <PageContainer>
      <Container>
        <HeaderSection>
          <Title>Vos résultats RIASEC</Title>
          <Description>
            <p>
              Découvrez votre profil professionnel basé sur la méthode RIASEC. Vos réponses ont été analysées pour chaque dimension, avec un <span className="highlight">score maximum de 60 points</span> par dimension.
            </p>
            <p>
              Ces scores sont calculés à partir de vos réponses dans quatre thèmes principaux :
            </p>
            <div className="themes">
              <span className="theme-tag">Activités</span>
              <span className="theme-tag">Occupations</span>
              <span className="theme-tag">Aptitudes</span>
              <span className="theme-tag">Personnalité</span>
            </div>
            <p style={{ marginTop: '1rem' }}>
              <span className="highlight">Plus votre score est élevé</span>, plus cette dimension correspond à vos intérêts professionnels.
            </p>
          </Description>
        </HeaderSection>

        <TestInfo>
          <InfoItem $icon="'⏱️'">
            Durée du test : {formatTime(duration)}
          </InfoItem>
        </TestInfo>

        <PredominantLetters>
          {result.predominant.map((letter, index) => (
            <LetterBadge key={letter}>
              {letter}
              <span>{RIASEC_LETTERS.find(l => l.id === letter).label}</span>
            </LetterBadge>
          ))}
        </PredominantLetters>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Votre profil RIASEC global
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <RadarChart data={result.graphData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 14 }} />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, maxScore]} 
                      tickCount={5}
                      tick={{ fill: '#666' }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#9c27b0"
                      fill="#9c27b0"
                      fillOpacity={0.6}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} / 60`, 'Score total']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #9c27b0'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <ScoreTable>
          <TableHeader>Détail des scores par thème</TableHeader>
          <TableContent>
            <ThemeRow>
              <ThemeLabel>Thème</ThemeLabel>
              {RIASEC_LETTERS.map(letter => (
                <ScoreCell key={letter.id}>{letter.label}</ScoreCell>
              ))}
            </ThemeRow>
            {RIASEC_THEMES.map(theme => (
              <ThemeRow key={theme.id}>
                <ThemeLabel>{theme.label}</ThemeLabel>
                {RIASEC_LETTERS.map(letter => (
                  <ScoreCell key={letter.id}>
                    {result.themes[theme.id][letter.id]}/15
                  </ScoreCell>
                ))}
              </ThemeRow>
            ))}
            <ThemeRow>
              <ThemeLabel>Score Total</ThemeLabel>
              {RIASEC_LETTERS.map(letter => (
                <ScoreCell key={letter.id} $isTotal>
                  {result.scores[letter.id]}/60
                </ScoreCell>
              ))}
            </ThemeRow>
          </TableContent>
        </ScoreTable>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default ResultRiasec; 