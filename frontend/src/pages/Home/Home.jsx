import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import userImage from '../../images/homepageImage.png';
import senseiStyle from '../../images/style-sensei.png';
import { useUserContext } from "../../context/userContext.jsx";
import useError from '../../hooks/useError';
import api from '../../utils/api';

const SenseiImage = styled.img`
  position: absolute;
  right: 100px;
  top: 30px;
  width: 100px;
  height: auto;

  @media (max-width: 779px) {
    display: none;
  }
`;

const StyledTitle = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 20px;

  @media (max-width: 779px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const UserImage = styled.img`
  position: absolute;
  right: 50px;
  bottom: 110px;
  transform: rotate(15deg);
  max-width: 100%;
  height: 400px;

  display: none;

  @media (max-width: 779px) {
    display: none;
  }
`;

// Composant de conteneur responsive
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  background-color: white;
  border: 1px solid #000;
  border-radius: 50px;
  width: 90%;
  margin: 30px auto;
  
  @media (max-width: 768px) {
    padding: 30px;
    width: 85%;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    width: 90%;
    border-radius: 30px;
  }
`;

// Section de contenu responsive
const ContentSection = styled.div`
  width: 90%;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Style de description responsive
const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #555;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Bouton responsive
const Button = styled.button`
  background-color: #fabc1c;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: transform 0.2s ease, background-color 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #e6a71a;
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 1rem;
    display: block;
    margin: 0 auto;
  }
`;

const Home = () => {
    const navigate = useNavigate();
    const { recordID, email, name, firstname } = useUserContext();

    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
    // Utilisation de notre hook de gestion d'erreur
    const { executeWithErrorHandling, showWarningToast } = useError();

    useEffect(() => {
        if (!recordID || !email || !name || !firstname) {
            setErrorMessage("Vous n'avez pas toutes les informations requises pour commencer le test, veuillez vous rapprocher de votre consultant");
            showWarningToast("Vous n'avez pas toutes les informations requises pour commencer le test, veuillez vous rapprocher de votre consultant");
            setIsButtonDisabled(true);
        } else {
            const checkHsObjectId = async (hsObjectId) => {
                return executeWithErrorHandling(async () => {
                    try {
                        // Utilisation de notre utilitaire API au lieu du fetch direct
                        const response = await api.get(`/personality-test/checkHsObjectId/${hsObjectId}`);
                        if (response.success) {
                            return response.data.exists;
                        } 
                        return null;
                    } catch (err) {
                        console.error('Erreur lors de la vérification de hs_object_id:', err);
                        return null; // Indique une erreur
                    }
                });
            };

            checkHsObjectId(recordID).then(exists => {
                if (exists === true) {
                    const message = "Impossible de faire le test deux fois pour le même utilisateur";
                    setErrorMessage(message);
                    showWarningToast(message);
                    setIsButtonDisabled(true);
                } else if (exists === false) {
                    setErrorMessage("");
                    setIsButtonDisabled(false);
                } else {
                    const message = "Une erreur est survenue lors de la vérification des informations. Veuillez réessayer.";
                    setErrorMessage(message);
                    showWarningToast(message);
                    setIsButtonDisabled(true);
                }
            });
        }
    }, [recordID, email, name, firstname, showWarningToast, executeWithErrorHandling]);

    const pageStyle = {
        backgroundColor: '#fdf6f1',
        minHeight: '90vh',
        padding: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
    };

    const handleClick = () => {
        if (!isButtonDisabled) {
            navigate('/mbti');
        } else {
            // Utiliser notre système pour afficher une erreur quand le bouton est cliqué alors qu'il est désactivé
            showWarningToast(errorMessage || "Vous ne pouvez pas accéder au test pour le moment.");
        }
    };

    return (
        <div style={pageStyle}>
            <SenseiImage src={senseiStyle} alt="style sensei"/>
            <Container>
                <ContentSection>
                    <StyledTitle>Test de Personnalité</StyledTitle>
                    <Description>
                        <strong>Bienvenue !</strong> Vous allez débuter un test de personnalité qui vous aidera à mieux vous connaître. 
                        <br /><br />
                        Ce test contient 30 questions à choix multiples. Vous serez confronté à des situations du quotidien professionnel pour lesquelles vous devrez choisir la réponse qui vous correspond le mieux. Répondez honnêtement afin d'obtenir un résultat précis.
                        <br /><br />
                        À la fin du test, vous recevrez un rapport détaillé sur votre personnalité, comprenant des caractéristiques dominantes, des forces et des points d'amélioration potentiels.
                        <br /><br />
                        <span style={{color: 'red', fontWeight: 'bold'}}>{errorMessage}</span>
                    </Description>
                    <Button onClick={handleClick} disabled={isButtonDisabled}>
                        Commencer le test
                    </Button>
                </ContentSection>
                <UserImage src={userImage} alt="User portrait"/>
            </Container>
        </div>
    );
};

export default Home;
