import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import './index.css';

const App = () => {
  const navigate = useNavigate();
  
  // State to manage the theme
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default is light theme
  
  const handleStartClick = () => {
    navigate('/riskprofile');
  };

  const handleTradingPanelClick = () => {
    navigate('/tradingpanel');
  };

  const handleUserPortfolioModuleClick = () => {
    navigate('/userportfolio');
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    if (!isDarkTheme) {
      document.documentElement.classList.add('dark'); // Apply dark theme
      document.documentElement.classList.remove('light'); // Remove light theme
    } else {
      document.documentElement.classList.add('light'); // Apply light theme
      document.documentElement.classList.remove('dark'); // Remove dark theme
    }
  };

  return (
    <div className='app__bg'>
      <button className='form-button' onClick={handleStartClick}>
        RISK PROFILE MODULE
      </button>
      <button className='form-button' onClick={handleTradingPanelClick}>
        TRADING PANEL MODULE
      </button>
      <button className='form-button' onClick={handleUserPortfolioModuleClick}>
        USER PORTFOLIO MODULE
      </button>
      <button className='form-button' onClick={handleThemeToggle}>
        CHANGE THEME
      </button>
      <Outlet /> {/* This is where nested routes will be rendered */}
    </div>
  );
};

export default App;
