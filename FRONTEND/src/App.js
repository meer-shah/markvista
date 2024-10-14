import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/riskprofile');
  };

  const handleTradingPanelClick = () => {
    navigate('/tradingpanel');
  };

  const handleUserPortfolioModuleClick = () => {
    navigate('/userportfolio');
  };

  const handleSetGoalsModuleClick = () => {
    navigate('/setgoals');
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
      <button className='form-button' onClick={handleSetGoalsModuleClick}>
        SET GOALS
      </button>
      <Outlet /> {/* This is where nested routes will be rendered */}
    </div>
  );
};

export default App;

