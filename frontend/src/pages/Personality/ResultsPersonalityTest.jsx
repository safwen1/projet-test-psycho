import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Container, Box, Paper, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import Jauge from '../../images/jauge.png';
import Rouge from '../../images/Rouge.mp4';
import Bleu from '../../images/Bleu.mp4';
import Marron from '../../images/Marron.mp4';
import Vert from '../../images/Vert.mp4';
import useError from '../../hooks/useError';

const GlobalStyle = styled('div')({
    backgroundColor: '#fdf6f1',
    minHeight: '100vh',
    width: '100%',
});

const StyledContainer = styled(Container)(({ theme }) => ({
    minHeight: '100vh',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    }
}));

const Title = styled(Typography)(({ theme }) => ({
    fontFamily: 'Kanit, sans-serif',
    fontWeight: 700,
    fontSize: '2rem',
    textAlign: 'center',
    color: '#000',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
    }
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem',
        marginBottom: theme.spacing(4),
    }
}));

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

const LeftCard = styled(StyledCard)(({ theme }) => ({
    backgroundColor: '#ffe5ae',
}));

const RightCard = styled(StyledCard)(({ theme }) => ({
    backgroundColor: '#ffcfb8',
}));

const InfoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '16px',
    backgroundColor: '#fff',
    border: '1px solid #000',
    marginTop: theme.spacing(4),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    }
}));

const ResultContent = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: '30px',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(3),
    }
}));

const VideoContainer = styled('div')(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    }
}));

const ProfileInfo = styled('div')(({ theme }) => ({
    width: '45%',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    }
}));

const Video = styled('video')(({ theme }) => ({
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    [theme.breakpoints.down('sm')]: {
        maxHeight: '300px',
    }
}));

const ResultsPersonalityTest = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
    
    // Utiliser notre hook de gestion d'erreur
    const { showWarningToast } = useError({
        // Désactiver l'affichage automatique des toasts car on utilise déjà ToastContainer
        showToast: false
    });
    
    useEffect(() => {
        // Vérifier si les données sont disponibles
        if (!data || !data.results) {
            showWarningToast("Aucun résultat n'est disponible. Veuillez refaire le test.");
            // Rediriger vers la page d'accueil après un délai
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [data, navigate, showWarningToast]);

    const getVideo = (color) => {
        switch (color) {
            case 'Rouge':
                return Rouge;
            case 'Bleu':
                return Bleu;
            case 'Marron':
                return Marron;
            case 'Vert':
                return Vert;
            default:
                return null;
        }
    };

    const videoSrc = getVideo(data?.results?.colors);
    
    if (!data || !data.results) {
        return (
            <GlobalStyle>
                <StyledContainer maxWidth="lg">
                    <Box textAlign="center" my={8}>
                        <Typography variant="h4" color="error" gutterBottom>
                            Aucun résultat disponible
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Nous n'avons pas pu récupérer vos résultats. Veuillez refaire le test.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ mt: 3 }}
                            onClick={() => navigate('/')}
                        >
                            Retour à l'accueil
                        </Button>
                    </Box>
                </StyledContainer>
                <ToastContainer />
            </GlobalStyle>
        );
    }

    return (
        <GlobalStyle>
            <StyledContainer maxWidth="lg">
                <Box>
                    <Title variant="h2">
                        Vos Résultats de Personnalité
                    </Title>
                    <Subtitle variant="h6">
                        Découvrez ce qui vous caractérise et comment cela peut vous guider.
                    </Subtitle>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <LeftCard>
                            <CardContent>
                                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                                    Couleur: {data?.results?.colors || 'N/A'}
                                </Typography>
                            </CardContent>
                        </LeftCard>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <RightCard>
                            <CardContent>
                                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                                    Lettre: {data?.results?.letters || 'N/A'}
                                </Typography>
                            </CardContent>
                        </RightCard>
                    </Grid>
                </Grid>

                <InfoPaper elevation={3}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 2 }}>
                        Votre Résumé Personnalisé
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Ce premier aperçu n'est qu'une étape. Lors de votre rendez-vous avec notre consultant,
                        vous bénéficierez d'un éclairage professionnel sur vos résultats.
                        Ensemble, nous explorerons comment aligner vos forces sur vos objectifs,
                        dessiner un plan d'action personnalisé, et transformer vos atouts en véritables
                        leviers pour atteindre vos ambitions.
                    </Typography>

                    <ResultContent>
                        <VideoContainer>
                            {videoSrc ? (
                                <Video controls>
                                    <source src={videoSrc} type="video/mp4" />
                                    Votre navigateur ne supporte pas la lecture vidéo.
                                </Video>
                            ) : (
                                'Vidéo à venir'
                            )}
                        </VideoContainer>
                        <ProfileInfo>
                            <Typography variant="h6">
                                Votre profil correspond à {data.randomNumber}% de la population
                            </Typography>
                            <img src={Jauge} alt="Jauge" style={{ width: '100px', marginTop: '16px' }} />
                        </ProfileInfo>
                    </ResultContent>
                </InfoPaper>
            </StyledContainer>
            <ToastContainer />
        </GlobalStyle>
    );
};

export default ResultsPersonalityTest;
