import React from 'react';
import './tradeoverview.css';

const TradeOverview = () => {
  const tradeData = [
    { number: 'X', heading: 'Best Trade' },
    { number: 'Y', heading: 'Worst Trade' },
    { number: 'Z', heading: 'Average Trade' },
    { number: 'A', heading: 'No. of Trades' },
    { number: 'B', heading: 'Winrate' },
    { number: 'C', heading: 'Average Loss' },
    { number: 'D', heading: 'Average Win' },
  ];

  return (
    <div className="tradeoverview-container">
      <h2 className="small__heading additional">Trades Summary</h2>
      <div className="trade-summary-section">
        {tradeData.map((item, index) => (
          <div key={index} className="trade-summary-item">
            <div className="trade-number">{item.number}</div>
            <div className="trade-heading p__basic">{item.heading}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeOverview;
