import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home/Home';
import IntroRiasec from '../pages/RIASEC/IntroRiasec';
import AppRiasecTest from '../pages/RIASEC/AppRiasecTest';
import ResultRiasec from '../pages/RIASEC/ResultRiasec';
import IntroBigFive from '../pages/BigFive/IntroBigFive';
import AppBigFiveTest from '../pages/BigFive/AppBigFiveTest';
import ResultBigFive from '../pages/BigFive/ResultBigFive';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<Home />} />

      {/* Routes pour le test RIASEC */}
      <Route path="/riasec" element={<IntroRiasec />} />
      <Route path="/riasec/test" element={<AppRiasecTest />} />
      <Route path="/riasec/results" element={<ResultRiasec />} />

      {/* Routes pour le test Big Five */}
      <Route path="/bigfive" element={<IntroBigFive />} />
      <Route path="/bigfive/test" element={<AppBigFiveTest />} />
      <Route path="/bigfive/results" element={<ResultBigFive />} />
    </Routes>
  );
};

export default AppRoutes; 