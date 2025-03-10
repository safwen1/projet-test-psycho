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
    const { recordID, email, name, firstname, refreshFromLocalStorage, clearUserData } = useUserContext();

    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
    // Vérification du localStorage et des valeurs du contexte
    useEffect(() => {    
        console.log('Valeurs du contexte:', { recordID, email, name, firstname });
        
        // Si les données ne sont pas disponibles dans le contexte mais sont dans le localStorage,
        // forcer la récupération depuis le localStorage
        if ((!recordID || !email || !name || !firstname) && 
            (localStorage.getItem('hs_object_id') || localStorage.getItem('email') || 
             localStorage.getItem('lastname') || localStorage.getItem('firstname'))) {
            console.log('Tentative de récupération des données depuis le localStorage...');
            const refreshedData = refreshFromLocalStorage();
            console.log('Données récupérées:', refreshedData);
        }
    }, [recordID, email, name, firstname, refreshFromLocalStorage]);
    
    // Utilisation de notre hook de gestion d'erreur
    const { executeWithErrorHandling, showWarningToast } = useError();

    useEffect(() => {
        // Vérifier si les données utilisateur sont disponibles
        const missingData = [];
        
        if (!recordID) missingData.push("ID d'enregistrement");
        if (!email) missingData.push("email");
        if (!name) missingData.push("nom");
        if (!firstname) missingData.push("prénom");
        
        if (missingData.length > 0) {
            const message = `Vous n'avez pas toutes les informations requises pour commencer le test (${missingData.join(', ')} manquant). Veuillez vous rapprocher de votre consultant.`;
            setErrorMessage(message);
            showWarningToast(message);
            setIsButtonDisabled(true);
        } else {
            const checkHsObjectId = async (hsObjectId) => {
                return executeWithErrorHandling(async () => {
                    try {
                        console.log('Vérification du hs_object_id:', hsObjectId);
                        
                        // Vérifier que hsObjectId est bien un nombre
                        if (!hsObjectId || isNaN(parseInt(hsObjectId))) {
                            console.error('hs_object_id invalide:', hsObjectId);
                            showWarningToast("L'identifiant d'enregistrement est invalide. Veuillez vous rapprocher de votre consultant.");
                            return null;
                        }
                        
                        // Utilisation de notre utilitaire API au lieu du fetch direct
                        const response = await api.get(`/personality-test/checkHsObjectId/${hsObjectId}`, {}, {
                            showErrorToast: true
                        });
                        
                        console.log('Réponse de l\'API:', response);
                        
                        // Vérifier si la réponse est un succès
                        if (!response.success) {
                            console.error('Erreur dans la réponse API:', response.error);
                            return null;
                        }
                        
                        // Extraire la valeur de exists selon la structure de la réponse
                        let exists = null;
                        
                        if (response.data && typeof response.data.exists === 'boolean') {
                            // Structure: { success: true, data: { exists: boolean, ... } }
                            console.log('Valeur de exists (structure directe):', response.data.exists);
                            exists = response.data.exists;
                        } else if (response.data && response.data.data && typeof response.data.data.exists === 'boolean') {
                            // Structure: { success: true, data: { data: { exists: boolean, ... } } }
                            console.log('Valeur de exists (structure imbriquée):', response.data.data.exists);
                            exists = response.data.data.exists;
                        } else {
                            // Structure inattendue
                            console.error('Structure de réponse inattendue:', response);
                            return null;
                        }
                        
                        return exists;
                    } catch (err) {
                        console.error('Erreur lors de la vérification de hs_object_id:', err);
                        return null; // Indique une erreur
                    }
                });
            };

            checkHsObjectId(recordID).then(exists => {
                console.log('Résultat de la vérification:', exists);
                
                if (exists === true) {
                    const message = "Impossible de faire le test deux fois pour le même utilisateur";
                    setErrorMessage(message);
                    showWarningToast(message);
                    setIsButtonDisabled(true);
                } else if (exists === false) {
                    // L'utilisateur peut passer le test
                    setErrorMessage("");
                    setIsButtonDisabled(false);
                } else {
                    // Si exists est null, c'est qu'il y a eu une erreur
                    const message = "Une erreur est survenue lors de la vérification des informations. Veuillez réessayer.";
                    setErrorMessage(message);
                    showWarningToast(message);
                    
                    // Afficher des informations de débogage
                    console.error('Erreur lors de la vérification du hs_object_id. Valeur de recordID:', recordID);
                    console.log('Contenu du localStorage:', {
                        hs_object_id: localStorage.getItem('hs_object_id'),
                        user_id: localStorage.getItem('user_id')
                    });
                    
                    // Tenter de récupérer les données du localStorage
                    const refreshedData = refreshFromLocalStorage();
                    console.log('Tentative de récupération des données:', refreshedData);
                    
                    setIsButtonDisabled(true);
                }
            }).catch(error => {
                console.error('Erreur non gérée lors de la vérification:', error);
                const message = "Une erreur inattendue est survenue. Veuillez réessayer ultérieurement.";
                setErrorMessage(message);
                showWarningToast(message);
                setIsButtonDisabled(true);
            });
        }
    }, [recordID, email, name, firstname, showWarningToast, executeWithErrorHandling, refreshFromLocalStorage]);

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

    // Fonction pour forcer la récupération des données depuis le localStorage
    const handleRefreshData = () => {
        const refreshedData = refreshFromLocalStorage();
        console.log('Données récupérées manuellement:', refreshedData);
        showWarningToast("Tentative de récupération des données depuis le localStorage effectuée.");
        
        // Recharger la page après un court délai
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };
    
    // Fonction pour réinitialiser les données
    const handleResetData = () => {
        clearUserData();
        showWarningToast("Toutes les données ont été réinitialisées.");
        
        // Recharger la page après un court délai
        setTimeout(() => {
            window.location.reload();
        }, 1500);
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
