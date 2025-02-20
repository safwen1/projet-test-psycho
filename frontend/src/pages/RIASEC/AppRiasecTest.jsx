import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LinearProgress, Box, Typography, Slider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RIASEC_QUESTIONS,
  RIASEC_SCALE,
} from '../../constants/RIASEC/data';
import styleSensei from '../../images/style-sensei.png';

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
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
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
    background: linear-gradient(90deg, #9c27b0, #7b1fa2);
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
  gap: 2rem;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const SliderContainer = styled.div`
  width: 100%;
  padding: 1rem;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const TimerContainer = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
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
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: "Kanit", sans-serif;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }
`;

const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
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
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
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
    background: linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%);
    transform: translateX(2px);
  }
`;

const AppRiasecTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimer, setShowTimer] = useState(location.state?.showTimer ?? true);
  const [responses, setResponses] = useState({
    riasec: {},
  });
  const [currentSection, setCurrentSection] = useState('R');
  const sections = ['R', 'I', 'A', 'S', 'E', 'C'];

  // Calculer le nombre total de questions RIASEC
  const totalQuestions = Object.values(RIASEC_QUESTIONS).reduce((acc, questions) => acc + questions.length, 0);

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
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    const sectionIndex = Math.floor(currentQuestionIndex / 8);
    const questionIndex = currentQuestionIndex % 8;
    return {
      type: 'riasec',
      section: sections[sectionIndex],
      question: RIASEC_QUESTIONS[sections[sectionIndex]][questionIndex]
    };
  };

  const getSliderValue = (current) => {
    return responses.riasec[current.question.id] || 3;
  };

  const handleSliderChange = (value) => {
    const current = getCurrentQuestion();
    setResponses(prev => ({
      ...prev,
      riasec: {
        ...prev.riasec,
        [current.question.id]: value
      }
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      const endTime = Date.now();
      const testDuration = Math.round((endTime - startTime) / 1000); // Durée en secondes
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/riasec/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses: responses,
            testDuration,
            startTime,
            endTime
          }),
        });

        if (response.ok) {
          const data = await response.json();
          navigate('/riasec/results', { 
            state: { 
              result: data.result,
              duration: data.duration
            } 
          });
        } else {
          toast.error('Erreur lors de la soumission du test');
        }
      } catch (error) {
        toast.error('Erreur de connexion');
        console.error('Erreur:', error);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      if (currentQuestionIndex < totalQuestions - 1 && (currentQuestionIndex + 1) % 8 === 0) {
        const nextSectionIndex = Math.floor((currentQuestionIndex + 1) / 8);
        setCurrentSection(sections[nextSectionIndex]);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const newIndex = currentQuestionIndex - 1;
      const sectionIndex = Math.floor(newIndex / 8);
      setCurrentSection(sections[sectionIndex]);
    }
  };

  const handleTimerClick = () => {
    setShowTimer(!showTimer);
  };

  const renderCurrentQuestion = () => {
    const current = getCurrentQuestion();
    return (
      <>
        <SectionTitle>Section {current.section}</SectionTitle>
        <QuestionText>{current.question.text}</QuestionText>
        <ScaleContainer>
          <SliderContainer>
            <Slider
              value={getSliderValue(current)}
              onChange={(_, value) => handleSliderChange(value)}
              min={1}
              max={5}
              step={1}
              marks
              sx={{
                '& .MuiSlider-rail': {
                  backgroundColor: '#e1bee7',
                  height: 8,
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#9c27b0',
                  height: 8,
                },
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  backgroundColor: '#fff',
                  border: '2px solid #9c27b0',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(156, 39, 176, 0.16)',
                  },
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#bbb',
                  height: 8,
                  width: 2,
                },
                '& .MuiSlider-markActive': {
                  backgroundColor: '#fff',
                },
              }}
            />
            <SliderLabels>
              <span>N'aime pas</span>
              <span>Aime beaucoup</span>
            </SliderLabels>
          </SliderContainer>
        </ScaleContainer>
      </>
    );
  };

  const isCurrentQuestionAnswered = () => {
    const current = getCurrentQuestion();
    return responses.riasec[current.question.id] !== undefined;
  };

  return (
    <>
      <GlobalStyle />
      <QuizContainer>
        <TimerContainer onClick={handleTimerClick}>
          {showTimer ? formatTime(elapsedTime) : ''}
        </TimerContainer>

        <ProgressContainer>
          <LinearProgress
            variant="determinate"
            value={(currentQuestionIndex / totalQuestions) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e1bee7',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#9c27b0',
                borderRadius: 5,
              },
            }}
          />
          <ProgressText>
            Question {currentQuestionIndex + 1} sur {totalQuestions}
          </ProgressText>
        </ProgressContainer>

        {renderCurrentQuestion()}

        <NavigationButtons>
          <PreviousButton
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
          >
            Précédent
          </PreviousButton>
          <NextButton
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Terminer' : 'Suivant'}
          </NextButton>
        </NavigationButtons>
      </QuizContainer>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AppRiasecTest; 