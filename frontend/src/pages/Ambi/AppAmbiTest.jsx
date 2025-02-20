import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LinearProgress, Slider, Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ambiQuestions, ambiScale } from '../../constants/Ambi/data';
import styleSensei from '../../images/style-sensei.png';
import { useUserContext } from '../../context/userContext';

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
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 18px !important;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #4caf50, #388e3c);
    border-radius: 3px;

    @media (max-width: 480px) {
      width: 40px;
      height: 2px;
      bottom: -8px;
    }
  }
`;

const ScaleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 30px;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-top: 15px;
  }
`;

const ScaleButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 2px solid ${props => props.$active ? '#4caf50' : '#e0e0e0'};
  border-radius: 10px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)'
    : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Nunito", sans-serif;

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.95rem;
    margin: 0.4rem 0;
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
    margin: 0.3rem 0;
    border-width: 1px;
  }

  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)'
      : '#f8f9fa'};
    border-color: ${props => props.$active ? '#388e3c' : '#ced4da'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  width: 100%;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    gap: 0.5rem;
  }
`;

const PreviousButton = styled.button`
  background: linear-gradient(135deg, #a8a8a8 0%, #808080 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  &:hover {
    background: linear-gradient(135deg, #808080 0%, #666666 100%);
    transform: translateX(-2px);
  }
`;

const NextButton = styled.button`
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  &:hover {
    background: linear-gradient(135deg, #388e3c 0%, #2e7d32 100%);
    transform: translateX(2px);
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  padding: 0 1rem;

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
`;

const StyledLinearProgress = styled(LinearProgress)`
  height: 10px !important;
  border-radius: 5px !important;
  background-color: #e9ecef !important;

  .MuiLinearProgress-bar {
    background: linear-gradient(90deg, #4caf50, #388e3c) !important;
    border-radius: 5px;
  }
`;

const ProgressText = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 8px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 12px;
    margin-top: 6px;
  }
`;

const TimerContainer = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  padding: 8px 16px;
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
    padding: 6px 12px;
    font-size: 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    top: -30px;
    padding: 5px 10px;
    font-size: 11px;
    gap: 4px;
    border-radius: 8px;
  }

  &::before {
    content: '⏱️';
    font-size: 14px;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

const SenseiImage = styled.img`
  position: absolute;
  right: -100px;
  bottom: -50px;
  width: 100px;
  height: auto;

  @media (max-width: 750px) {
    display: none;
  }
`;

const SliderContainer = styled(Box)`
  width: 100%;
  padding: 2rem 3.5rem;
  margin-top: 1rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem 2.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
  }
`;

const SliderLabel = styled(Typography)`
  color: #666;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
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

const SpeakerButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4caf50;
  transition: all 0.3s ease;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.3rem;
  }

  &:hover {
    transform: translateY(-50%) scale(1.1);
    color: #388e3c;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const marks = [
  { value: 1, label: 'Tout à fait en désaccord' },
  { value: 2, label: '' },
  { value: 3, label: '' },
  { value: 4, label: 'Neutre' },
  { value: 5, label: '' },
  { value: 6, label: '' },
  { value: 7, label: 'Tout à fait d\'accord' },
];

const AppAmbiTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token, projectTaskId } = useUserContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStartTimes, setQuestionStartTimes] = useState([Date.now()]);
  const [testStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showTimer, setShowTimer] = useState(location.state?.showTimer ?? true);
  const [randomQuestionOrder] = useState(() => {
    const indices = Array.from({ length: ambiQuestions.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = ((currentQuestion + 1) / ambiQuestions.length) * 100;

  useEffect(() => {
    setQuestionStartTimes(prev => [...prev, Date.now()]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const handleAnswerSelect = (event, value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = (answers, dimension) => {
    const dimensionAnswers = answers.filter(a => a.dimension === dimension);
    const totalScore = dimensionAnswers.reduce((acc, curr) => {
      const score = curr.isReversed ? 8 - curr.answer : curr.answer;
      return acc + score;
    }, 0);
    const maxScore = dimensionAnswers.length * 7;
    return Math.round((totalScore / maxScore) * 100);
  };

  const submitResults = async (scores, userAnswers, testDuration, averageResponseTime) => {
    try {
      // Envoi à l'API locale
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ambi/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scores,
          userAnswers,
          testDuration,
          averageResponseTime
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des résultats');
      }

      // Envoi à l'endpoint externe
      const externalResponse = await fetch('https://dev.app.sensei-france.fr/psycho_tests/new_results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results: {
            score: scores,
            userAnswers: Object.fromEntries(userAnswers.map(answer => [answer.question, answer.answer]))
          },
          nomTest: "Test de personnalité AMBTI",
          user_id: userId,
          token,
          project_task_id: projectTaskId,
          idTest: "ambti"
        })
      });

      if (!externalResponse.ok) {
        throw new Error('Erreur lors de l\'envoi des résultats à l\'endpoint externe');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des résultats:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    if (currentQuestion + 1 < ambiQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const formattedAnswers = Object.entries(answers).map(([index, value]) => {
        const questionData = ambiQuestions[randomQuestionOrder[parseInt(index)]];
        return {
          question: questionData.question,
          answer: value,
          dimension: questionData.dimension,
          isReversed: questionData.isReversed
        };
      });

      const dimensions = ['E', 'A', 'C', 'S', 'O'];
      const scores = {};
      dimensions.forEach(dim => {
        scores[dim] = calculateScore(formattedAnswers, dim);
      });

      try {
        const testDuration = Math.round((Date.now() - testStartTime) / 1000);
        const responseTimes = questionStartTimes.slice(1).map((time, index) => {
          const prevTime = questionStartTimes[index];
          return time - prevTime;
        });
        const averageResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);

        await submitResults(scores, formattedAnswers, testDuration, averageResponseTime);
        navigate('/ambi/results', { 
          state: { 
            scores,
            testDuration,
            averageResponseTime
          }
        });
      } catch (error) {
        toast.error('Erreur lors de la soumission des résultats. Veuillez réessayer.');
      }
    }
  };

  const formatTime = (startTime) => {
    const seconds = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimerClick = () => {
    setShowTimer(!showTimer);
  };

  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      // Arrêter toute lecture en cours
      window.speechSynthesis.cancel();

      const textToRead = ambiQuestions[randomQuestionOrder[currentQuestion]].question;
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      setIsReading(true);
      
      utterance.onend = () => {
        setIsReading(false);
      };

      utterance.onerror = () => {
        setIsReading(false);
        toast.error('Erreur lors de la lecture vocale');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('La synthèse vocale n\'est pas supportée par votre navigateur');
    }
  };

  return (
    <>
      <GlobalStyle />
      <QuizContainer>
        <TimerContainer onClick={handleTimerClick}>
          {showTimer ? formatTime(testStartTime) : ''}
        </TimerContainer>

        <ProgressContainer>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion / ambiQuestions.length) * 100} 
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e8f5e9',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50',
                borderRadius: 5,
              }
            }}
          />
          <ProgressText>
            Question {currentQuestion + 1} sur {ambiQuestions.length}
          </ProgressText>
        </ProgressContainer>

        <QuestionContainer>
          <QuestionText>
            {ambiQuestions[randomQuestionOrder[currentQuestion]].question}
          </QuestionText>
          <SpeakerButton 
            onClick={readQuestion}
            disabled={isReading}
            title="Lire la question à voix haute"
          >
            {isReading ? '🔊' : '🔈'}
          </SpeakerButton>
        </QuestionContainer>

        <SliderContainer>
          <Slider
            value={answers[currentQuestion] || 4}
            onChange={handleAnswerSelect}
            min={1}
            max={7}
            step={1}
            marks={marks}
            sx={{
              '& .MuiSlider-rail': {
                height: 8,
                backgroundColor: '#e0e0e0',
              },
              '& .MuiSlider-track': {
                height: 8,
                backgroundColor: '#4caf50',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                border: '2px solid #4caf50',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(76, 175, 80, 0.16)',
                },
                '&.Mui-active': {
                  boxShadow: '0 0 0 12px rgba(76, 175, 80, 0.16)',
                },
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#e0e0e0',
                height: 8,
                width: 2,
                '&.MuiSlider-markActive': {
                  backgroundColor: '#fff',
                },
              },
              '& .MuiSlider-markLabel': {
                fontFamily: '"Nunito", sans-serif',
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '10px',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                transform: 'translate(-50%, 0)',
                '&[data-index="0"]': {
                  transform: 'translate(0%, 0)',
                },
                '&[data-index="6"]': {
                  transform: 'translate(-100%, 0)',
                },
              },
            }}
          />
        </SliderContainer>

        <NavigationButtons>
          <PreviousButton
            disabled={currentQuestion === 0}
            onClick={handlePrevious}
          >
            Précédent
          </PreviousButton>
          <NextButton
            disabled={answers[currentQuestion] === undefined}
            onClick={handleNext}
          >
            {currentQuestion + 1 === ambiQuestions.length ? 'Terminer' : 'Suivant'}
          </NextButton>
        </NavigationButtons>

        <SenseiImage src={styleSensei} alt="Style Sensei" />
      </QuizContainer>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AppAmbiTest; 