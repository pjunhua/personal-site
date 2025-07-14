import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomepageIntroHandler from './HomepageIntroHandler';
import Home from './pages/Home/Home'
import { LogInProvider } from './context/LogInContext';
import { NavProvider } from './context/NavigationContext';

import './App.css'

function App() {
  return (
    <LogInProvider>
      <NavProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terminal" element={<HomepageIntroHandler />} />
          </Routes>
        </Router>
      </NavProvider>
    </LogInProvider >
  );
}

export default App;