import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LinearProgress, Slider, Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  gcbsQuestions,
  gcbsScale,
  tipiQuestions,
  tipiScale,
} from '../../constants/GCBS/data';
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
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    font-family: "Nunito", sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
`;

const TestContainer = styled.div`
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
    background: linear-gradient(90deg, #2196f3, #1976d2) !important;
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
    background: linear-gradient(90deg, #2196f3, #1976d2);
    border-radius: 3px;

    @media (max-width: 480px) {
      width: 40px;
      height: 2px;
      bottom: -8px;
    }
  }
`;

const OptionsContainer = styled.div`
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

const OptionButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 2px solid ${props => props.$active ? '#2196f3' : '#e0e0e0'};
  border-radius: 10px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
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
      ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
      : '#f8f9fa'};
    border-color: ${props => props.$active ? '#1976d2' : '#ced4da'};
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
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
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
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    transform: translateX(2px);
  }
`;

const TimerContainer = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
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

const VocabularyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.6rem;
  }
`;

const VocabularyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.$checked ? '#2196f3' : '#e0e0e0'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.8rem;
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem;
    gap: 0.6rem;
    font-size: 0.9rem;
    border-width: 1px;
  }

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
  }
`;

const DemographicForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2196f3;
  }
`;

const SliderContainer = styled(Box)`
  width: 100%;
  padding: 2rem 3.5rem;
  margin-top: 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SliderLabel = styled(Typography)`
  color: #666;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: '#2196f3',
  height: 8,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)',
    },
  },
  '& .MuiSlider-track': {
    height: 8,
    background: 'linear-gradient(90deg, #2196f3, #1976d2)',
  },
  '& .MuiSlider-rail': {
    height: 8,
    backgroundColor: '#e0e0e0',
    opacity: 1,
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 12,
    width: 2,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.875rem',
    fontFamily: '"Nunito", sans-serif',
    color: '#666',
  },
}));

const OptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
`;

const OptionText = styled.div`
  width: 45%;
  text-align: ${props => props.$align};
  color: #2d3436;
  font-size: 1rem;
  font-weight: ${props => props.$selected ? '600' : '400'};
`;

const AppGcbsTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token, projectTaskId } = useUserContext();
  const [currentSection, setCurrentSection] = useState('gcbs');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gcbsAnswers, setGcbsAnswers] = useState([]);
  const [tipiAnswers, setTipiAnswers] = useState([]);
  const [testStartTime] = useState(Date.now());
  const [sectionStartTime, setSectionStartTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState([Date.now()]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showTimer, setShowTimer] = useState(location.state?.showTimer ?? true);

  useEffect(() => {
    setQuestionStartTimes(prev => [...prev, Date.now()]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion, currentSection]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTotalQuestions = () => {
    switch (currentSection) {
      case 'gcbs':
        return gcbsQuestions.length;
      case 'tipi':
        return tipiQuestions.length;
      default:
        return 0;
    }
  };

  const getProgress = () => {
    const totalQuestions = gcbsQuestions.length + tipiQuestions.length;
    let completedQuestions = 0;

    switch (currentSection) {
      case 'gcbs':
        completedQuestions = currentQuestion;
        break;
      case 'tipi':
        completedQuestions = gcbsQuestions.length + currentQuestion;
        break;
      default:
        completedQuestions = 0;
    }

    return {
      current: completedQuestions + 1,
      total: totalQuestions,
      percentage: (completedQuestions / totalQuestions) * 100
    };
  };

  const handleAnswer = (value) => {
    const currentTime = Date.now();
    const timeSpent = currentTime - questionStartTimes[questionStartTimes.length - 1];

    if (currentSection === 'gcbs') {
      const newAnswers = [...gcbsAnswers];
      newAnswers[currentQuestion] = {
        questionId: gcbsQuestions[currentQuestion].id,
        answer: value,
        timeSpent,
        orientation: Math.random() < 0.5 ? 1 : 2,
        position: currentQuestion
      };
      setGcbsAnswers(newAnswers);
    } else if (currentSection === 'tipi') {
      const newAnswers = [...tipiAnswers];
      newAnswers[currentQuestion] = {
        questionId: tipiQuestions[currentQuestion].id,
        answer: value,
        timeSpent
      };
      setTipiAnswers(newAnswers);
    }
  };

  const calculateScores = () => {
    // Calcul des scores GCBS
    const gcbsScores = {
      RA: 0,
      LP: 0,
      MF: 0,
      V: 0
    };

    gcbsAnswers.forEach(answer => {
      const question = gcbsQuestions.find(q => q.id === answer.questionId);
      gcbsScores[question.dimension] += answer.answer;
    });

    // Normalisation des scores GCBS
    Object.keys(gcbsScores).forEach(key => {
      const maxScore = gcbsQuestions.filter(q => q.dimension === key).length * 5;
      gcbsScores[key] = Math.round((gcbsScores[key] / maxScore) * 100);
    });

    // Calcul des scores TIPI
    const tipiScores = {
      E: 0,
      A: 0,
      C: 0,
      S: 0,
      O: 0
    };

    tipiAnswers.forEach(answer => {
      const question = tipiQuestions.find(q => q.id === answer.questionId);
      const score = question.isReversed ? 8 - answer.answer : answer.answer;
      tipiScores[question.dimension] += score;
    });

    // Normalisation des scores TIPI
    Object.keys(tipiScores).forEach(key => {
      const questionsCount = tipiQuestions.filter(q => q.dimension === key).length;
      const maxScore = questionsCount * 7;
      tipiScores[key] = Math.round((tipiScores[key] / maxScore) * 100);
    });

    return { gcbsScores, tipiScores };
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection === 'tipi') {
      setCurrentSection('gcbs');
      setCurrentQuestion(gcbsQuestions.length - 1);
    }
  };

  const submitResults = async (results) => {
    try {
      // Envoi à l'API locale
      const response = await fetch(`${import.meta.env.VITE_API_URL}/gcbs/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
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
            score: {
              ...results.gcbsScores,
              ...results.tipiScores
            },
            userAnswers: {
              ...Object.fromEntries(results.gcbsAnswers.map(answer => [
                gcbsQuestions.find(q => q.id === answer.questionId).optionA,
                answer.answer
              ])),
              ...Object.fromEntries(results.tipiAnswers.map(answer => [
                tipiQuestions.find(q => q.id === answer.questionId).question,
                answer.answer
              ]))
            }
          },
          nomTest: "Test de Croyances GCBS",
          user_id: userId,
          token,
          project_task_id: projectTaskId,
          idTest: "gcbs"
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
    if (currentSection === 'gcbs' && currentQuestion + 1 < gcbsQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection === 'gcbs') {
      setCurrentSection('tipi');
      setCurrentQuestion(0);
      setSectionStartTime(Date.now());
    } else if (currentSection === 'tipi' && currentQuestion + 1 < tipiQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection === 'tipi') {
      const { gcbsScores, tipiScores } = calculateScores();
      const testDuration = Math.round((Date.now() - testStartTime) / 1000);

      try {
        const results = {
          gcbsScores,
          gcbsAnswers,
          tipiScores,
          tipiAnswers,
          timings: {
            introElapse: Math.round((sectionStartTime - testStartTime) / 1000),
            testElapse: testDuration,
            surveyElapse: Math.round((Date.now() - sectionStartTime) / 1000)
          }
        };

        await submitResults(results);
        navigate('/gcbs/results', { 
          state: { 
            gcbsScores,
            tipiScores,
            testDuration
          }
        });
      } catch (error) {
        toast.error(error.message || 'Erreur lors de la soumission des résultats. Veuillez réessayer.');
      }
    }
  };

  const formatTime = (ms) => {
    const elapsedSeconds = Math.floor((currentTime - ms) / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const remainingSeconds = elapsedSeconds % 60;
    return `${elapsedMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSliderMarks = (isABQuestion) => {
    if (isABQuestion) {
      return [
        { value: 0, label: 'Forte préf. A' },
        { value: 25, label: 'Préf. A' },
        { value: 50, label: 'Neutre' },
        { value: 75, label: 'Préf. B' },
        { value: 100, label: 'Forte préf. B' }
      ];
    }
    return [
      { value: 0, label: 'Pas du tout d\'accord' },
      { value: 25, label: '' },
      { value: 50, label: 'Neutre' },
      { value: 75, label: '' },
      { value: 100, label: 'Tout à fait d\'accord' }
    ];
  };

  const handleSliderChange = (event, value) => {
    handleAnswer(value);
  };

  const renderCurrentSection = () => {
    if (currentSection === 'gcbs') {
      return (
        <>
          <QuestionText>
            {getCurrentQuestion().text || 'Choisissez entre les deux options :'}
          </QuestionText>
          {renderQuestion()}
        </>
      );
    } else if (currentSection === 'tipi') {
      return (
        <>
          <QuestionText>{getCurrentQuestion().text}</QuestionText>
          {renderQuestion()}
        </>
      );
    }
    return null;
  };

  const renderQuestion = () => {
    switch (currentSection) {
      case 'gcbs':
        const currentGcbsQuestion = gcbsQuestions[currentQuestion];
        return (
          <div>
            <OptionContainer>
              <OptionText 
                $align="left" 
                $selected={gcbsAnswers[currentQuestion]?.answer < 50}
              >
                {currentGcbsQuestion.optionA}
              </OptionText>
              <OptionText 
                $align="right" 
                $selected={gcbsAnswers[currentQuestion]?.answer > 50}
              >
                {currentGcbsQuestion.optionB}
              </OptionText>
            </OptionContainer>
            <SliderContainer>
              <CustomSlider
                value={gcbsAnswers[currentQuestion]?.answer || 50}
                onChange={handleSliderChange}
                step={25}
                marks={getSliderMarks(true)}
                valueLabelDisplay="off"
              />
            </SliderContainer>
          </div>
        );

      case 'tipi':
        const currentTipiQuestion = tipiQuestions[currentQuestion];
        return (
          <div>
            <QuestionText>{currentTipiQuestion.question}</QuestionText>
            <SliderContainer>
              <CustomSlider
                value={tipiAnswers[currentQuestion]?.answer || 50}
                onChange={handleSliderChange}
                step={25}
                marks={getSliderMarks(false)}
                valueLabelDisplay="off"
              />
            </SliderContainer>
          </div>
        );

      default:
        return null;
    }
  };

  const getCurrentQuestion = () => {
    switch (currentSection) {
      case 'gcbs':
        return gcbsQuestions[currentQuestion];
      case 'tipi':
        return tipiQuestions[currentQuestion];
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (currentSection) {
      case 'gcbs':
        return !gcbsAnswers[currentQuestion];
      case 'tipi':
        return !tipiAnswers[currentQuestion];
      default:
        return true;
    }
  };

  const handleTimerClick = () => {
    setShowTimer(!showTimer);
  };

  return (
    <>
      <GlobalStyle />
      <TestContainer>
        <TimerContainer onClick={handleTimerClick}>
          {showTimer ? formatTime(testStartTime) : ''}
        </TimerContainer>

        <ProgressContainer>
          <StyledLinearProgress variant="determinate" value={getProgress().percentage} />
          <ProgressText>
            Question {getProgress().current} sur {getProgress().total}
          </ProgressText>
        </ProgressContainer>

        {renderCurrentSection()}

        <NavigationButtons>
          <PreviousButton
            disabled={currentQuestion === 0 && currentSection === 'gcbs'}
            onClick={handlePrevious}
          >
            Précédent
          </PreviousButton>
          <NextButton
            disabled={isNextDisabled()}
            onClick={handleNext}
          >
            {currentSection === 'tipi' ? 'Terminer' : 'Suivant'}
          </NextButton>
        </NavigationButtons>

        <SenseiImage src={styleSensei} alt="Style Sensei" />
      </TestContainer>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AppGcbsTest; 