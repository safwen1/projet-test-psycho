import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

import { Home } from "./pages/index";

import AppPersonalityTest from "./pages/Personality/AppPersonalityTest.jsx";
import ResultsPersonalityTest from "./pages/Personality/ResultsPersonalityTest.jsx";

import { Navbar } from "./components/index";

// Conteneur principal avec styles responsive
const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fdf6f1;
  
  // S'assurer que tout le contenu est visible même sur petits écrans
  @media (max-width: 480px) {
    overflow-x: hidden;
  }
`;

// Configuration des toasts pour qu'ils soient responsive
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  // Ajuster les styles pour les appareils mobiles
  style: {
    fontSize: window.innerWidth < 480 ? '14px' : '16px',
    maxWidth: window.innerWidth < 480 ? '90%' : '400px',
  }
};

const App = () => {
  return (
    <AppContainer>
        <Navbar />
        <Routes>
            {/*  HOMEPAGE  */}
            <Route path="/" exact element={<Home />} />

            {/*  PAGES TEST PERSONALITE MBTI  */}
            <Route path="/mbti" exact element={<AppPersonalityTest />} />
            <Route path="/mbti/results" exact element={<ResultsPersonalityTest />} />
        </Routes>
        
        {/* ToastContainer global optimisé pour le responsive */}
        <ToastContainer {...toastConfig} />
    </AppContainer>
  );
};

export default App;
