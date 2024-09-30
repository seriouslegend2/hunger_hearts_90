import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserHomePage from './pages/UserHomePage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/u_login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        
        <Route path="/user/user_homepage" element={<UserHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
