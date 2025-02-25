import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home/Home';
import IntroAmbi from '../pages/Ambi/IntroAmbi';
import AppAmbiTest from '../pages/Ambi/AppAmbiTest';
import AmbiResults from '../pages/Ambi/AmbiResults';
import IntroGcbs from '../pages/GCBS/IntroGcbs';
import AppGcbsTest from '../pages/GCBS/AppGcbsTest';
import GcbsResults from '../pages/GCBS/GcbsResults';
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

      {/* Routes pour le test AMBI */}
      <Route path="/ambi" element={<IntroAmbi />} />
      <Route path="/ambi/test" element={<AppAmbiTest />} />
      <Route path="/ambi/results" element={<AmbiResults />} />

      {/* Routes pour le test GCBS */}
      <Route path="/gcbs" element={<IntroGcbs />} />
      <Route path="/gcbs/test" element={<AppGcbsTest />} />
      <Route path="/gcbs/results" element={<GcbsResults />} />

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