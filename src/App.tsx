import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomepageIntroHandler from './HomepageIntroHandler';
import Home from './pages/Home/Home'
import { LogInProvider } from './context/LogInContext';
import { NavProvider } from './context/NavigationContext';

import './App.css'

function App() {
  return (
    <GoogleOAuthProvider clientId="122597640985-au0vmq9obt5pga1tfbgge1km8phv2oml.apps.googleusercontent.com">
      <LogInProvider>
        <NavProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/terminal" element={<HomepageIntroHandler />} />
            </Routes>
          </Router>
        </NavProvider>
      </LogInProvider>
    </GoogleOAuthProvider>
  );
}

export default App;