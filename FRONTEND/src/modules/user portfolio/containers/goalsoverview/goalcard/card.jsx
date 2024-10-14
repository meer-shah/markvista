import React from 'react';
import './card.css'; // Import the CSS file for the card styling

const Card = ({ totalProfit, goalPercentage, goalType , goalammount}) => {
  // Determine the color of the progress bar based on the goal percentage
  const progressColor = goalPercentage >= 0 ? 'var(--color-profit)' : 'var(--color-loss)'; // Green for positive, Red for negative

  // Determine the color of the total profit based on the total profit value
  const profitColor = totalProfit >= 0 ? 'var(--color-profit)' : 'var(--color-loss)'; // Green for positive, Red for negative

  return (
    <div className="card">
      <h2 className="small__heading heading">{goalType} Goal</h2>
      <p className="small__heading heading">  ${goalammount.toLocaleString()}
      </p>
      <p className="total-profit-label">Total Profit</p>
      <p className="total-profit" style={{ color: profitColor }}>
        ${totalProfit.toLocaleString()}
      </p>
      <p className="progress-label">{goalType} Goal Achieved: {goalPercentage}%</p>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.abs(goalPercentage)}%`, backgroundColor: progressColor }}
        ></div>
      </div>
    </div>
  );
};

export default React.memo(Card);
