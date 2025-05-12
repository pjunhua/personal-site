import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomepageIntroHandler from './HomepageIntroHandler.tsx';
import Home from './pages/Home/Home.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/personal-site" element={<Home />} />
        <Route path="/personal-site/terminal" element={<HomepageIntroHandler />} />
      </Routes>
    </Router>
  );
}

export default App;