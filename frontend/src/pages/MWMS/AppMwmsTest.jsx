import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { 
  LinearProgress, 
  Box, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel,
  Slider,
  IconButton,
  Tooltip
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MWMS_QUESTIONS, MWMS_SCALE } from '../../constants/MWMS/data';
import usePreventNavigation from '../../hooks/usePreventNavigation';
import axios from 'axios';
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
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
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
  margin-bottom: 0.5rem;
  text-align: center;
  color: #2d3436;
  position: relative;
  animation: ${fadeIn} 0.4s ease-out;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 18px !important;
    margin-bottom: 0.5rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledRadioGroup = styled(RadioGroup)`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 0.3rem 0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: ${props => props.checked ? 'rgba(51, 164, 116, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.checked ? '#33A474' : 'transparent'};

  &:hover {
    background-color: rgba(51, 164, 116, 0.05);
  }

  .MuiFormControlLabel-label {
    font-size: 1rem;
    color: #333;
  }

  .MuiRadio-root.Mui-checked {
    color: #33A474;
  }
`;

const ScaleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const ScaleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const ScaleItem = styled.div`
  text-align: center;
  width: ${100 / 7}%;
`;

const SliderContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
  margin-top: 1rem;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const ValueBubble = styled.div`
  position: absolute;
  top: -40px;
  left: ${props => ((props.value - 1) / 6) * 100}%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #33A474 0%, #2E7D32 100%);
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 14px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #2E7D32 transparent transparent transparent;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
  padding: 0 2.5rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
    flex-direction: ${props => props.$isFirstQuestion ? 'row-reverse' : 'row'};
    justify-content: ${props => props.$isFirstQuestion ? 'flex-end' : 'space-between'};
  }

  @media (max-width: 480px) {
    padding: 0 1.5rem;
  }
`;

const NavigationButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #33A474 0%, #2E7D32 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &:hover {
      background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(1px);
    }

    &:disabled {
      background: #cccccc;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: transparent;
    color: #33A474;
    border: 2px solid #33A474;

    &:hover {
      background: rgba(51, 164, 116, 0.05);
    }

    &:active {
      transform: translateY(1px);
    }

    &:disabled {
      border-color: #cccccc;
      color: #cccccc;
      cursor: not-allowed;
    }
  `}
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const TimerContainer = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: linear-gradient(135deg, #33A474 0%, #2E7D32 100%);
  padding: ${props => props.expanded ? '8px 16px' : '8px'};
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
    padding: ${props => props.expanded ? '6px 12px' : '6px'};
    font-size: 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    top: -30px;
    padding: ${props => props.expanded ? '5px 10px' : '5px'};
    font-size: 11px;
    gap: 4px;
    border-radius: 8px;
  }
`;

const SenseiImage = styled.img`
  position: absolute;
  top: -50px;
  right: -30px;
  width: 100px;
  height: auto;
  transform: rotate(15deg);
  z-index: 10;

  @media (max-width: 768px) {
    width: 80px;
    top: -40px;
    right: -20px;
  }

  @media (max-width: 480px) {
    width: 60px;
    top: -30px;
    right: -10px;
  }
`;

const InstructionText = styled.p`
  font-size: 1.1rem;
  color: #555;
  text-align: center;
  margin-bottom: 2rem;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const AudioButton = styled(IconButton)`
  color: #33A474;
  transition: all 0.3s ease;
  margin-left: 8px;
  background-color: rgba(51, 164, 116, 0.05);
  
  &:hover {
    color: #2E7D32;
    background-color: rgba(51, 164, 116, 0.1);
    transform: scale(1.1);
  }
  
  &:disabled {
    color: #cccccc;
  }

  ${props => props.isSpeaking && `
    animation: pulse 1.5s infinite;
    background-color: rgba(51, 164, 116, 0.2);
  `}

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(51, 164, 116, 0.4);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(51, 164, 116, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(51, 164, 116, 0);
    }
  }
`;

const QuestionTextContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;

const AppMwmsTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useUserContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [showTimer, setShowTimer] = useState(location.state?.showTimer ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [timerExpanded, setTimerExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef(null);

  // Utiliser le hook pour empêcher la navigation
  usePreventNavigation(true, "Êtes-vous sûr de vouloir quitter ? Vos réponses seront perdues.");

  // Gérer le timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Gérer l'événement beforeunload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Êtes-vous sûr de vouloir quitter ? Vos réponses seront perdues.";
      return event.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Formater le temps
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Gérer le changement de réponse
  const handleRadioChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  // Vérifier si la question actuelle a une réponse
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = MWMS_QUESTIONS[currentQuestionIndex];
    return answers[currentQuestion.id] !== undefined;
  };

  // Calculer les scores
  const calculateScores = () => {
    // Initialiser les scores par catégorie
    const categoryScores = {
      intrinsicMotivation: 0,
      identifiedRegulation: 0,
      introjectedRegulation: 0,
      externalSocialRegulation: 0,
      externalMaterialRegulation: 0
    };
    
    // Compter les questions par catégorie
    const categoryCounts = {
      intrinsicMotivation: 0,
      identifiedRegulation: 0,
      introjectedRegulation: 0,
      externalSocialRegulation: 0,
      externalMaterialRegulation: 0
    };

    // Calculer les scores par catégorie
    MWMS_QUESTIONS.forEach(question => {
      if (answers[question.id] !== undefined) {
        categoryScores[question.category] += answers[question.id];
        categoryCounts[question.category]++;
      }
    });

    // Calculer les moyennes par catégorie
    const averageScores = {};
    Object.keys(categoryScores).forEach(category => {
      averageScores[category] = categoryCounts[category] > 0 
        ? categoryScores[category] / categoryCounts[category] 
        : 0;
    });

    // Calculer les scores des dimensions principales
    const autonomousMotivation = (averageScores.intrinsicMotivation + averageScores.identifiedRegulation) / 2;
    const introjectedRegulation = averageScores.introjectedRegulation;
    const externalRegulation = (averageScores.externalSocialRegulation + averageScores.externalMaterialRegulation) / 2;

    return {
      scores: {
        autonomousMotivation,
        introjectedRegulation,
        externalRegulation
      },
      dimensions: averageScores
    };
  };

  // Gérer le bouton suivant
  const handleNext = () => {
    if (currentQuestionIndex < MWMS_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // Gérer le bouton précédent
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  // Gérer la soumission du test
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const scores = calculateScores();
      const duration = formatTime(seconds);
      
      const response = await axios.post('/api/mwms/submit', {
        responses: answers,
        scores,
        duration,
        userId
      });
      
      if (response.data.success) {
        navigate('/mwms/results', { 
          state: { 
            result: response.data.result,
            duration: response.data.duration
          }
        });
      } else {
        toast.error('Une erreur est survenue lors de la soumission du test.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du test:', error);
      toast.error('Une erreur est survenue lors de la soumission du test.');
      setIsSubmitting(false);
    }
  };

  // Gérer le clic sur le timer
  const handleTimerClick = () => {
    setTimerExpanded(prev => !prev);
  };

  // Calculer la progression
  const getCurrentProgress = () => {
    return ((currentQuestionIndex + 1) / MWMS_QUESTIONS.length) * 100;
  };

  // Obtenir le nombre de questions restantes
  const getRemainingQuestions = () => {
    return MWMS_QUESTIONS.length - (currentQuestionIndex + 1);
  };

  // Gérer le changement de réponse avec le slider
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    handleRadioChange(MWMS_QUESTIONS[currentQuestionIndex].id, newValue);
  };

  // Afficher la bulle de valeur lors du changement de slider
  const handleSliderChangeStart = () => {
    setShowBubble(true);
  };

  // Cacher la bulle de valeur après un délai
  const handleSliderChangeEnd = () => {
    setTimeout(() => {
      setShowBubble(false);
    }, 1000);
  };

  // Fonction pour lire la question à haute voix
  const speakQuestion = () => {
    // Arrêter toute lecture en cours
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    // Créer un nouvel objet SpeechSynthesisUtterance
    const speech = new SpeechSynthesisUtterance();
    speech.text = MWMS_QUESTIONS[currentQuestionIndex].question;
    speech.lang = 'fr-FR';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    // Événements pour suivre l'état de la lecture
    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    speech.onerror = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
      toast.error('Erreur lors de la lecture audio');
    };

    // Stocker la référence à l'objet speech
    speechSynthesisRef.current = speech;

    // Lancer la lecture
    window.speechSynthesis.speak(speech);
  };

  // Arrêter la lecture audio lors du changement de question
  useEffect(() => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
  }, [currentQuestionIndex]);

  // Arrêter la lecture audio lors du démontage du composant
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Rendu du composant
  return (
    <>
      <GlobalStyle />
      <ToastContainer position="top-center" />
      
      <QuizContainer>
        
        {showTimer && (
          <TimerContainer onClick={handleTimerClick} expanded={timerExpanded}>
            ⏱️ {timerExpanded && formatTime(seconds)}
          </TimerContainer>
        )}
        
        <ProgressContainer>
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              variant="determinate" 
              value={getCurrentProgress()} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: 'rgba(51, 164, 116, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#33A474',
                }
              }} 
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Question {currentQuestionIndex + 1}/{MWMS_QUESTIONS.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getRemainingQuestions()} question{getRemainingQuestions() > 1 ? 's' : ''} restante{getRemainingQuestions() > 1 ? 's' : ''}
            </Typography>
          </Box>
        </ProgressContainer>
        
        <InstructionText>
          Veuillez indiquer dans quelle mesure cette affirmation représente vos raisons de fournir des efforts dans votre travail.
        </InstructionText>
        
        <QuestionContainer>
          <QuestionTextContainer>
            <QuestionText>
              {MWMS_QUESTIONS[currentQuestionIndex].question}
            </QuestionText>
            <Tooltip title={isSpeaking ? "Arrêter la lecture" : "Lire la question"}>
              <AudioButton 
                onClick={isSpeaking ? () => window.speechSynthesis.cancel() : speakQuestion}
                aria-label={isSpeaking ? "Arrêter la lecture" : "Lire la question"}
                size="small"
                isSpeaking={isSpeaking}
              >
                {isSpeaking ? <VolumeUpIcon /> : <VolumeUpIcon />}
              </AudioButton>
            </Tooltip>
          </QuestionTextContainer>
          
          <OptionsContainer>
            <SliderContainer>
              <Box sx={{ position: 'relative', width: '100%', padding: '0 10px' }}>
                <ValueBubble 
                  value={answers[MWMS_QUESTIONS[currentQuestionIndex].id] || 1} 
                  visible={showBubble || answers[MWMS_QUESTIONS[currentQuestionIndex].id]}
                >
                  {answers[MWMS_QUESTIONS[currentQuestionIndex].id] || 1}
                </ValueBubble>
                <Slider
                  value={answers[MWMS_QUESTIONS[currentQuestionIndex].id] || 1}
                  onChange={handleSliderChange}
                  onChangeCommitted={handleSliderChangeEnd}
                  onMouseDown={handleSliderChangeStart}
                  onTouchStart={handleSliderChangeStart}
                  min={1}
                  max={7}
                  step={1}
                  marks
                  sx={{
                    color: '#33A474',
                    height: 8,
                    '& .MuiSlider-track': {
                      border: 'none',
                      backgroundColor: '#33A474',
                    },
                    '& .MuiSlider-thumb': {
                      height: 24,
                      width: 24,
                      backgroundColor: '#fff',
                      border: '2px solid #33A474',
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(51, 164, 116, 0.16)',
                      },
                      '&:before': {
                        display: 'none',
                      },
                    },
                    '& .MuiSlider-valueLabel': {
                      lineHeight: 1.2,
                      fontSize: 12,
                      background: 'unset',
                      padding: 0,
                      width: 32,
                      height: 32,
                      borderRadius: '50% 50% 50% 0',
                      backgroundColor: '#33A474',
                      transformOrigin: 'bottom left',
                      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                      '&:before': { display: 'none' },
                      '&.MuiSlider-valueLabelOpen': {
                        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                      },
                      '& > *': {
                        transform: 'rotate(45deg)',
                      },
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: '#bfbfbf',
                      height: 8,
                      width: 2,
                      '&.MuiSlider-markActive': {
                        opacity: 1,
                        backgroundColor: 'currentColor',
                      },
                    },
                  }}
                />
              </Box>
              <SliderLabels>
                <Typography variant="body2">Pas du tout</Typography>
                <Typography variant="body2">Moyennement</Typography>
                <Typography variant="body2">Tout à fait</Typography>
              </SliderLabels>
            </SliderContainer>
          </OptionsContainer>
        </QuestionContainer>
        
        <ButtonContainer $isFirstQuestion={currentQuestionIndex === 0}>
          {currentQuestionIndex > 0 && (
            <NavigationButton onClick={handleBack}>
              ← Précédent
            </NavigationButton>
          )}
          
          <NavigationButton 
            $primary 
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered() || isSubmitting}
          >
            {currentQuestionIndex < MWMS_QUESTIONS.length - 1 ? 'Suivant →' : 'Terminer le test'}
          </NavigationButton>
        </ButtonContainer>
      </QuizContainer>
    </>
  );
};

export default AppMwmsTest; 