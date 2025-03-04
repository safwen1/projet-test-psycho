import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LinearProgress, Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RIASEC_QUESTIONS,
  RIASEC_SCALE,
  RIASEC_THEMES,
  RIASEC_LETTERS
} from '../../constants/RIASEC/data';
import styleSensei from '../../images/style-sensei.png';
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
  font-weight: 500;
`;

const ThemeText = styled.div`
  color: #9c27b0;
  font-weight: 600;
  margin-top: 0.3rem;
`;

const PageCounter = styled.div`
  font-size: 0.85rem;
  color: #9c27b0;
  font-weight: 500;
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

const CheckboxGroup = styled(FormGroup)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0rem;
  width: 100%;
  margin-top: 0.5rem;
`;

const StyledCheckbox = styled(FormControlLabel)`
  margin: 0.25rem;
  padding: 0.25rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(156, 39, 176, 0.1);
  }

  .MuiCheckbox-root {
    color: #9c27b0;
    &.Mui-checked {
      color: #7b1fa2;
    }
  }

  .MuiTypography-root {
    font-family: "Nunito", sans-serif;
    color: #333;
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
  color: #9c27b0;
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
    color: #7b1fa2;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const NoSelectionButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  background: transparent;
  border: 2px dashed #9c27b0;
  border-radius: 8px;
  color: #9c27b0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Nunito", sans-serif;
  font-weight: 500;

  &:hover {
    background: rgba(156, 39, 176, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RadioButtonsGroup = styled(RadioGroup)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(156, 39, 176, 0.05);
  border-radius: 8px;
`;

const StyledRadio = styled(FormControlLabel)`
  margin: 0;
  .MuiRadio-root {
    color: #9c27b0;
    &.Mui-checked {
      color: #7b1fa2;
    }
  }
  .MuiTypography-root {
    font-family: "Nunito", sans-serif;
    color: #333;
    font-size: 0.9rem;
  }
`;

const QuestionItem = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const AppRiasecTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizContainerRef = React.useRef(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentLetter, setCurrentLetter] = useState('R');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimer, setShowTimer] = useState(location.state?.showTimer ?? true);
  const [responses, setResponses] = useState({});
  const [isReading, setIsReading] = useState(false);

  // Activation de la prévention de navigation pendant le test
  usePreventNavigation(
    true,
    "Si vous quittez maintenant, toutes vos réponses seront perdues. Voulez-vous vraiment abandonner le test ?",
    "Quitter le test Intérêts professionnels ?"
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
    
    console.log('Prévention de rechargement activée dans AppRiasecTest');
    
    // Nettoie les écouteurs lors du démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      console.log('Prévention de rechargement désactivée dans AppRiasecTest');
    };
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentThemeIndex, currentLetter]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const getCurrentTheme = () => RIASEC_THEMES[currentThemeIndex];
  const getCurrentQuestions = () => RIASEC_QUESTIONS[getCurrentTheme().id][currentLetter];

  const handleCheckboxChange = (questionId) => {
    const theme = getCurrentTheme().id;
    const newResponses = { ...responses };
    
    if (!newResponses[theme]) {
      newResponses[theme] = {};
    }
    if (!newResponses[theme][currentLetter]) {
      newResponses[theme][currentLetter] = [];
    }

    const currentResponses = newResponses[theme][currentLetter];
    const currentQuestion = getCurrentQuestions().find(q => q.id === questionId);
    const index = currentResponses.findIndex(r => r === currentQuestion.text);

    if (index === -1) {
      currentResponses.push(currentQuestion.text);
    } else {
      currentResponses.splice(index, 1);
    }

    setResponses(newResponses);
  };

  const isQuestionChecked = (questionId) => {
    const theme = getCurrentTheme().id;
    const question = getCurrentQuestions().find(q => q.id === questionId);
    return responses[theme]?.[currentLetter]?.includes(question.text) || false;
  };

  const handleNoSelection = () => {
    const theme = getCurrentTheme().id;
    const newResponses = { ...responses };
    
    if (!newResponses[theme]) {
      newResponses[theme] = {};
    }
    
    newResponses[theme][currentLetter] = ['aucune'];
    
    setResponses(newResponses);
  };

  const handleRadioChange = (questionId, value) => {
    const theme = getCurrentTheme().id;
    const newResponses = { ...responses };
    
    if (!newResponses[theme]) {
      newResponses[theme] = {};
    }
    if (!newResponses[theme][currentLetter]) {
      newResponses[theme][currentLetter] = {};
    }

    newResponses[theme][currentLetter][questionId] = parseInt(value);
    setResponses(newResponses);
  };

  const getRadioValue = (questionId) => {
    const theme = getCurrentTheme().id;
    return responses[theme]?.[currentLetter]?.[questionId]?.toString() || '';
  };

  const isCurrentSectionAnswered = () => {
    const theme = getCurrentTheme().id;
    if (theme === 'aptitudes') {
      const currentResponses = responses[theme]?.[currentLetter] || {};
      const questions = getCurrentQuestions();
      return questions.every(q => currentResponses[q.id] !== undefined);
    }
    return (responses[theme]?.[currentLetter]?.length > 0) || 
           (responses[theme]?.[currentLetter]?.includes('aucune'));
  };

  const renderQuestions = () => {
    const theme = getCurrentTheme().id;
    const questions = getCurrentQuestions();

    if (theme === 'aptitudes') {
      return (
        <div>
          {questions.map((question) => (
            <QuestionItem key={question.id}>
              <QuestionText>{question.text}</QuestionText>
              <RadioButtonsGroup
                row
                value={getRadioValue(question.id)}
                onChange={(e) => handleRadioChange(question.id, e.target.value)}
              >
                <StyledRadio value="1" control={<Radio />} label=" Je pense ne pas être bon(ne) dans cette tâche" />
                <StyledRadio value="2" control={<Radio />} label="Je pense être moyennement compétent(e)." />
                <StyledRadio value="3" control={<Radio />} label="Je pense être très compétent(e)." />
              </RadioButtonsGroup>
            </QuestionItem>
          ))}
        </div>
      );
    }

    return (
      <CheckboxContainer>
        <CheckboxGroup>
          {questions.map((question) => (
            <StyledCheckbox
              key={question.id}
              control={
                <Checkbox
                  checked={isQuestionChecked(question.id)}
                  onChange={() => handleCheckboxChange(question.id)}
                />
              }
              label={question.text}
            />
          ))}
        </CheckboxGroup>
        <NoSelectionButton 
          onClick={handleNoSelection}
          type="button"
        >
          Aucune proposition ne me correspond
        </NoSelectionButton>
      </CheckboxContainer>
    );
  };

  const calculateScores = () => {
    const scores = {
      themes: {},
      total: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    };

    // Calculer les scores par thème
    Object.entries(responses).forEach(([theme, themeResponses]) => {
      scores.themes[theme] = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      
      Object.entries(themeResponses).forEach(([letter, answers]) => {
        if (theme === 'aptitudes') {
          // Pour le thème aptitudes, sommer les valeurs (1, 2 ou 3)
          const sum = Object.values(answers).reduce((acc, val) => acc + val, 0);
          scores.themes[theme][letter] = sum;
          scores.total[letter] += sum;
        } else {
          // Pour les autres thèmes, compter le nombre de réponses positives
          const count = answers[0] === 'aucune' ? 0 : answers.length;
          scores.themes[theme][letter] = count;
          scores.total[letter] += count;
        }
      });
    });

    // Trouver les trois lettres prédominantes
    const sortedLetters = Object.entries(scores.total)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([letter]) => letter);

    return {
      ...scores,
      predominant: sortedLetters
    };
  };

  const handleNext = async () => {
    // Scroll vers le haut du conteneur
    if (quizContainerRef.current) {
      quizContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const isLastLetter = currentLetter === 'C';
    const isLastTheme = currentThemeIndex === RIASEC_THEMES.length - 1;

    if (isLastLetter && isLastTheme) {
      const scores = calculateScores();
      const duration = formatTime(elapsedTime);
      
      try {
        // Transformer les réponses pour l'API
        const transformedResponses = { ...responses };
        
        // Transformer les réponses d'aptitudes en tableau de chaînes
        if (transformedResponses.aptitudes) {
          Object.keys(transformedResponses.aptitudes).forEach(letter => {
            const aptitudesObj = transformedResponses.aptitudes[letter];
            transformedResponses.aptitudes[letter] = Object.entries(aptitudesObj)
              .map(([id, value]) => `${id}:${value}`);
          });
        }

        // Appel à l'API interne
        const response = await fetch(`${import.meta.env.VITE_API_URL}/riasec/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses: transformedResponses,
            scores,
            duration
          }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la soumission');
        }

        const data = await response.json();

        // Préparer les données pour le graphique
        const graphData = [
          { name: 'Réaliste', value: scores.total.R },
          { name: 'Investigatif', value: scores.total.I },
          { name: 'Artistique', value: scores.total.A },
          { name: 'Social', value: scores.total.S },
          { name: 'Entreprenant', value: scores.total.E },
          { name: 'Conventionnel', value: scores.total.C }
        ];

        // Transformer les réponses pour l'API externe
        const userAnswers = {};
        Object.entries(transformedResponses).forEach(([theme, themeResponses]) => {
          Object.entries(themeResponses).forEach(([letter, answers]) => {
            userAnswers[`${theme}_${letter}`] = Array.isArray(answers) ? answers : 
              Object.entries(answers).map(([id, value]) => `${id}:${value}`);
          });
        });

        // Appel à l'API externe
        const externalResponse = await fetch('https://dev.app.sensei-france.fr/psycho_tests/new_results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            results: {
              score: {
                ...scores.total,
                themes: scores.themes,
                predominant: scores.predominant
              },
              userAnswers
            },
            nomTest: "Test d'intérêts professionnels RIASEC",
            user_id: location.state?.userId || null,
            token: location.state?.token || null,
            project_task_id: location.state?.projectTaskId || null,
            idTest: "riasec"
          })
        });

        // Redirection vers la page de résultat actuelle
        navigate('/riasec/results', { 
          state: { 
            result: {
              scores: scores.total,
              themes: scores.themes,
              predominant: scores.predominant,
              graphData: graphData
            },
            duration: duration
          } 
        });

        /* 
        // Redirection vers la page de résultat générique
        // À activer ultérieurement
        navigate('/resultat');
        */
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la soumission du test');
      }
    } else if (isLastLetter) {
      setCurrentThemeIndex(prev => prev + 1);
      setCurrentLetter('R');
    } else {
      const nextLetter = RIASEC_LETTERS[RIASEC_LETTERS.findIndex(l => l.id === currentLetter) + 1].id;
      setCurrentLetter(nextLetter);
    }
  };

  const handleBack = () => {
    // Scroll vers le haut du conteneur
    if (quizContainerRef.current) {
      quizContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (currentLetter === 'R') {
      if (currentThemeIndex > 0) {
        setCurrentThemeIndex(prev => prev - 1);
        setCurrentLetter('C');
      }
    } else {
      const prevLetter = RIASEC_LETTERS[RIASEC_LETTERS.findIndex(l => l.id === currentLetter) - 1].id;
      setCurrentLetter(prevLetter);
    }
  };

  const handleTimerClick = () => {
    setShowTimer(!showTimer);
  };

  const getCurrentProgress = () => {
    const totalSteps = RIASEC_THEMES.length * RIASEC_LETTERS.length;
    const currentStep = (currentThemeIndex * RIASEC_LETTERS.length) + RIASEC_LETTERS.findIndex(l => l.id === currentLetter) + 1;
    return (currentStep / totalSteps) * 100;
  };

  const getRemainingPages = () => {
    const totalPages = RIASEC_THEMES.length * RIASEC_LETTERS.length;
    const currentPage = (currentThemeIndex * RIASEC_LETTERS.length) + RIASEC_LETTERS.findIndex(l => l.id === currentLetter) + 1;
    return totalPages - currentPage;
  };

  const readText = (text) => {
    if ('speechSynthesis' in window) {
      // Arrêter toute lecture en cours
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakerClick = () => {
    readText("Cochez toutes les propositions qui vous correspondent");
  };

  return (
    <>
      <GlobalStyle />
      <QuizContainer ref={quizContainerRef}>
        <TimerContainer onClick={handleTimerClick}>
          {showTimer ? formatTime(elapsedTime) : ''}
        </TimerContainer>

        <ProgressContainer>
          <LinearProgress
            variant="determinate"
            value={getCurrentProgress()}
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
            Question {(currentThemeIndex * RIASEC_LETTERS.length) + RIASEC_LETTERS.findIndex(l => l.id === currentLetter) + 1} sur 24
          </ProgressText>
          <ThemeText>
            Thème : {getCurrentTheme().label} - Section {currentLetter}
          </ThemeText>
        </ProgressContainer>

        <SectionTitle>
          {RIASEC_LETTERS.find(l => l.id === currentLetter).label}
        </SectionTitle>

        <QuestionContainer>
          <Typography variant="h6" style={{ marginBottom: '1.5rem', textAlign: 'center', position: 'relative' }}>
            {getCurrentTheme().id === 'aptitudes' 
              ? "Évaluez votre niveau pour chaque aptitude"
              : "Cochez toutes les propositions qui vous correspondent"}
            <SpeakerButton 
              onClick={handleSpeakerClick}
              disabled={isReading}
              title="Lire la question"
            >
              {isReading ? '🔊' : '🔈'}
            </SpeakerButton>
          </Typography>
          {renderQuestions()}
        </QuestionContainer>

        <NavigationButtons>
          <PreviousButton
            onClick={handleBack}
            disabled={currentThemeIndex === 0 && currentLetter === 'R'}
          >
            Précédent
          </PreviousButton>
          <NextButton
            onClick={handleNext}
            disabled={!isCurrentSectionAnswered()}
          >
            {currentThemeIndex === RIASEC_THEMES.length - 1 && currentLetter === 'C' ? 'Terminer' : 'Suivant'}
          </NextButton>
        </NavigationButtons>
      </QuizContainer>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default AppRiasecTest; 