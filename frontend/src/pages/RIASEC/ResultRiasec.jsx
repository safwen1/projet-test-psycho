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

  // Score maximum pour le graphique radar (20 = 5 points × 4 thèmes)
  const maxScore = 20;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Résultats de votre test RIASEC
      </Typography>

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
                    formatter={(value) => [`${value} / 20`, 'Score total']}
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

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Scores par thème
            </Typography>
            {RIASEC_THEMES.map(theme => (
              <ThemeScores key={theme.id}>
                <ThemeTitle>{theme.label}</ThemeTitle>
                <LetterScores>
                  {RIASEC_LETTERS.map(letter => (
                    <ScoreCard 
                      key={letter.id} 
                      $score={result.themes[theme.id][letter.id]}
                    >
                      <div className="letter">{letter.id}</div>
                      <div className="progress" />
                      <div className="score">
                        {result.themes[theme.id][letter.id]} / 5
                      </div>
                    </ScoreCard>
                  ))}
                </LetterScores>
              </ThemeScores>
            ))}
            <ThemeScores>
              <ThemeTitle>Score Total</ThemeTitle>
              <LetterScores>
                {RIASEC_LETTERS.map(letter => (
                  <ScoreCard 
                    key={letter.id} 
                    $score={result.scores[letter.id] / 4}
                  >
                    <div className="letter">{letter.id}</div>
                    <div className="progress" />
                    <div className="score">
                      {result.scores[letter.id]} / 20
                    </div>
                  </ScoreCard>
                ))}
              </LetterScores>
            </ThemeScores>
          </Paper>
        </Grid>
      </Grid>

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
  );
};

export default ResultRiasec; 