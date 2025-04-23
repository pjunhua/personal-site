import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomepageIntroHandler from './HomepageIntroHandler.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/personal-site" element={<HomepageIntroHandler />} />
      </Routes>
    </Router>
  );
}

export default App;