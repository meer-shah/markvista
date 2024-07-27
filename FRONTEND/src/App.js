import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {


 
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/riskprofile');
  };

  
  return (
    <div className='app__bg'>
      
      <button className='form-button' onClick={handleStartClick}>Start</button>
      <Outlet /> {/* This is where nested routes will be rendered */}
    </div>
  );
};

export default App;
