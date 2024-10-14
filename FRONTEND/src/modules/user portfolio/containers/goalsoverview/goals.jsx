


import React from 'react';
import Card from './goalcard/card'; // Import the Card component
import './goals.css'; // Import the CSS file for styling

const goalData = [
  {
    totalProfit: 500,
    goalPercentage: 70,
    goalType: 'Daily',
    goalammount: 100,
  },
  {
    totalProfit: 5000,
    goalPercentage: 80,
    goalType: 'Weekly',
    goalammount: 100,
  },
  {
    totalProfit: 10000,
    goalPercentage: 60,
    goalType: 'Monthly',
    goalammount: 100,
  },
  {
    totalProfit: 30000,
    goalPercentage: 90,
    goalType: 'Quarterly',
    goalammount: 100,
  },
  {
    totalProfit: 120000,
    goalPercentage: 75,
    goalType: 'Yearly',
    goalammount: 100,
  },
];


const Goals = () => {
  const filteredGoalData = goalData.filter(data => data.totalProfit != null && data.goalPercentage != null);

  
  return (
    <div>
      {filteredGoalData.length > 0 ? (
        <div>
          <div className="goals-container">
            {filteredGoalData.map((data, index) => (
              <Card key={index} {...data} /> // Render Card for each valid data object
            ))}
          </div>

          <div className="goal-actions">
            <button className="form-button">
              Update Goal
            </button>
            <button className="form-button">
              Delete Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="no-goals-message">
          <p>Set your goals to track your progress</p>
          <button className="form-button">Set Goal</button>
        </div>
      )}
    </div>
  );
};

export default Goals;