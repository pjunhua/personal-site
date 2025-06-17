import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomepageIntroHandler from './HomepageIntroHandler';
import Home from './pages/Home/Home'
import { LogInProvider } from './context/LogInContext';

import './App.css'

function App() {
  return (
    <LogInProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terminal" element={<HomepageIntroHandler />} />
        </Routes>
      </Router>
    </LogInProvider >
  );
}

export default App;