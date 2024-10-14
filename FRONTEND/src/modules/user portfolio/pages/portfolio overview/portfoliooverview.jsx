import React from 'react';
import { LSComponent, Accgrowth, Coinoverview, TradeOverview, Goals } from '../../containers/index';
import './portfoliooverview.css'; // Import the CSS file

const Portfoliooverview = () => {
  return (
    <div className="container">
      {/* First Main Section */}
      <div className="first-main-section">
        <div className="left-column">
          <TradeOverview />
          <Accgrowth />
          <LSComponent />
        </div>
        <div className="right-column">
          
          <Goals />
          
        </div>
      </div>

      {/* Second Main Section */}
      <div className="second-main-section">
        <Coinoverview />
      </div>
    </div>
  );
};

export default Portfoliooverview;
