import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomepageIntroHandler from './HomepageIntroHandler';
import Home from './pages/Home/Home'

import './App.css'

function App() {
  return (
    <Router basename="/personal-site">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terminal" element={<HomepageIntroHandler />} />
      </Routes>
    </Router>
  );
}

export default App;