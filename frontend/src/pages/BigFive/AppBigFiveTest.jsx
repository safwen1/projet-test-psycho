import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import {
  LinearProgress,
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import { VolumeUp, Timer } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BIG_FIVE_QUESTIONS } from '../../constants/BigFive/data';
import usePreventNavigation from '../../hooks/usePreventNavigation';

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

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
    font-family: "Nunito", sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
`;

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 70px auto 50px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease;
  position: relative;

  @media (max-width: 850px) {
    max-width: 95%;
    margin: 60px auto 40px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 50px auto 30px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin: 40px auto 20px;
    border-radius: 15px;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

const QuestionContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
  padding: 0 2.5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  @media (max-width: 480px) {
    padding: 0 1.5rem;
  }
`;

const QuestionText = styled.div`
  font-size: 24px !important;
  font-family: "Kanit", sans-serif !important;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #2d3436;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 18px !important;
    margin-bottom: 1rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #ff9800, #fb8c00);
    border-radius: 3px;

    @media (max-width: 480px) {
      width: 40px;
      height: 2px;
      bottom: -8px;
    }
  }
`;

const TimerContainer = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: linear-gradient(135deg, #ff9800 0%, #fb8c00 100%);
  padding: ${props => props.showTimer ? '8px 16px' : '8px'};
  border-radius: 12px;
  color: white;
  font-family: "Nunito", sans-serif;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    top: -35px;
    padding: ${props => props.showTimer ? '6px 12px' : '6px'};
    font-size: 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    top: -30px;
    padding: ${props => props.showTimer ? '5px 10px' : '5px'};
    font-size: 11px;
    gap: 4px;
    border-radius: 8px;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.primary ? 'linear-gradient(135deg, #ff9800 0%, #fb8c00 100%)' : '#fff3e0'};
  color: ${props => props.primary ? 'white' : '#ff9800'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const AppBigFiveTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimer, setShowTimer] = useState(location.state?.showTimer ?? true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Activation de la prévention de navigation pendant le test
  usePreventNavigation(
    true,
    "Si vous quittez maintenant, toutes vos réponses seront perdues. Voulez-vous vraiment abandonner le test ?",
    "Quitter le test Big Five ?"
  );

  // Solution directe pour bloquer le rechargement de la page
  useEffect(() => {
    // Fonction pour intercepter l'événement beforeunload (fermeture d'onglet, rechargement)
    const handleBeforeUnload = (event) => {
      const message = "Si vous quittez maintenant, toutes vos réponses seront perdues. Voulez-vous vraiment abandonner le test ?";
      event.preventDefault();
      event.returnValue = message;
      return message;
    };
    
    // Fonction pour intercepter les touches de rechargement (F5, Ctrl+R)
    const handleKeyDown = (event) => {
      // F5 key
      if (event.key === 'F5') {
        event.preventDefault();
        event.stopPropagation();
        console.log('Rechargement avec F5 bloqué');
        return false;
      }
      
      // Ctrl+R ou Cmd+R (Mac)
      if ((event.ctrlKey || event.metaKey) && (event.key === 'r' || event.keyCode === 82)) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Rechargement avec Ctrl+R bloqué');
        return false;
      }
    };
    
    // Ajoute les écouteurs d'événements au niveau global
    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    
    console.log('Prévention de rechargement activée dans AppBigFiveTest');
    
    // Nettoie les écouteurs lors du démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      console.log('Prévention de rechargement désactivée dans AppBigFiveTest');
    };
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [BIG_FIVE_QUESTIONS[currentQuestionIndex].code]: {
        content: BIG_FIVE_QUESTIONS[currentQuestionIndex].question,
        response: parseInt(value)
      }
    }));
  };

  const calculateScores = () => {
    const dimensions = {
      extraversion: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
      nevrosisme: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10'],
      agreabilite: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
      conscience: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
      ouverture: ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10']
    };

    const reversedQuestions = new Set([
      'E2', 'E4', 'E6', 'E8', 'E10',
      'N2', 'N4',
      'A1', 'A3', 'A5', 'A7',
      'C2', 'C4', 'C6', 'C8',
      'O2', 'O4', 'O6'
    ]);

    const scores = {};

    for (const [dimension, questions] of Object.entries(dimensions)) {
      let sum = 0;
      questions.forEach(code => {
        const answer = answers[code];
        if (answer) {
          const score = reversedQuestions.has(code) ? 6 - answer.response : answer.response;
          sum += score;
        }
      });
      scores[dimension] = sum;
    }

    return scores;
  };

  const handleNext = async () => {
    if (currentQuestionIndex === BIG_FIVE_QUESTIONS.length - 1) {
      try {
        const scores = calculateScores();
        const duration = formatTime(elapsedTime);
        const completedAt = new Date().toISOString();

        // Envoyer les données au backend local
        await fetch(`${import.meta.env.VITE_API_URL}/bigfive/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            responses: answers,
            scores,
            duration
          })
        });

        // Appel à l'API externe
        await fetch('https://dev.app.sensei-france.fr/psycho_tests/new_results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            results: {
              score: {
                extraversion: scores.extraversion,
                nevrosisme: scores.nevrosisme,
                agreabilite: scores.agreabilite,
                conscience: scores.conscience,
                ouverture: scores.ouverture
              },
              userAnswers: answers
            },
            nomTest: "Test de personnalité Big Five",
            user_id: location.state?.userId || null,
            token: location.state?.token || null,
            project_task_id: location.state?.projectTaskId || null,
            idTest: "bigfive"
          })
        });

        // Naviguer vers la page de résultats actuelle avec les données
        navigate('/bigfive/results', {
          state: {
            scores,
            userAnswers: answers,
            duration,
            completedAt
          }
        });

        /* 
        // Redirection vers la page de résultat générique
        // À activer ultérieurement
        navigate('/resultat');
        */
      } catch (error) {
        console.error('Erreur lors de la soumission du test:', error);
        toast.error('Une erreur est survenue lors de la soumission du test');
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleTimerClick = () => {
    setShowTimer(prev => !prev);
  };

  const readText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.onend = () => setIsSpeaking(false);
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      } else {
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const progress = ((currentQuestionIndex + 1) / BIG_FIVE_QUESTIONS.length) * 100;

  return (
    <>
      <GlobalStyle />
      <QuizContainer>
        <TimerContainer onClick={handleTimerClick} showTimer={showTimer}>
          <Timer fontSize="small" />
          {showTimer && formatTime(elapsedTime)}
        </TimerContainer>

        <ProgressContainer>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#fff3e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ff9800'
              }
            }}
          />
          <ProgressText>
            Question {currentQuestionIndex + 1} sur {BIG_FIVE_QUESTIONS.length}
          </ProgressText>
        </ProgressContainer>

        <QuestionContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <QuestionText>
              {BIG_FIVE_QUESTIONS[currentQuestionIndex].question}
            </QuestionText>
            <IconButton
              onClick={() => readText(BIG_FIVE_QUESTIONS[currentQuestionIndex].question)}
              sx={{ 
                color: isSpeaking ? '#ff9800' : '#666',
                '&:hover': {
                  backgroundColor: 'rgba(255, 152, 0, 0.1)'
                }
              }}
            >
              <VolumeUp />
            </IconButton>
          </Box>

          <RadioGroup
            value={answers[BIG_FIVE_QUESTIONS[currentQuestionIndex].code]?.response || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            sx={{ mt: 3 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={
                    <Radio 
                      sx={{
                        color: '#ff9800',
                        '&.Mui-checked': {
                          color: '#ff9800',
                        }
                      }}
                    />
                  }
                  label={
                    value === 1 ? "Pas du tout d'accord" :
                    value === 2 ? "Plutôt pas d'accord" :
                    value === 3 ? "Neutre" :
                    value === 4 ? "Plutôt d'accord" :
                    "Tout à fait d'accord"
                  }
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.1)'
                    }
                  }}
                />
              ))}
            </Box>
          </RadioGroup>
        </QuestionContainer>

        <ButtonContainer>
          <Button onClick={handleBack} disabled={currentQuestionIndex === 0}>
            Question précédente
          </Button>
          <Button
            primary
            onClick={handleNext}
            disabled={!answers[BIG_FIVE_QUESTIONS[currentQuestionIndex].code]}
          >
            {currentQuestionIndex === BIG_FIVE_QUESTIONS.length - 1 ? 'Terminer' : 'Question suivante'}
          </Button>
        </ButtonContainer>
      </QuizContainer>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AppBigFiveTest; 