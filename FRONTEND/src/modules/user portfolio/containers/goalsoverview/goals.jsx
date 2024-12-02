import React, { useEffect, useState } from 'react';
import Card from './goalcard/card'; // Import the Card component
import './goals.css'; // Import the CSS file for styling

const Goals = () => {
  const [goals, setGoals] = useState([]); // State to store fetched goals
  const [processedGoals, setProcessedGoals] = useState([]); // State to store processed goals

  // Fetch data from the backend
  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/goal/goals'); // Replace with your backend API endpoint
      const data = await response.json();
      console.log(data);
      setGoals(data); // Store fetched goals
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  // Function to divide goals into smaller types
  const processGoals = (data) => {
    const smallerGoals = [];

    data.forEach(goal => {
      if (goal.goalType === 'Yearly') {
        smallerGoals.push(
          { goalType: 'Quarterly', goalAmount: goal.goalAmount / 4 },
          { goalType: 'Monthly', goalAmount: goal.goalAmount / 12 },
          { goalType: 'Weekly', goalAmount: goal.goalAmount / 52 },
          { goalType: 'Daily', goalAmount: goal.goalAmount / 365 }
        );
      } else if (goal.goalType === 'Quarterly') {
        smallerGoals.push(
          { goalType: 'Monthly', goalAmount: goal.goalAmount / 3 },
          { goalType: 'Weekly', goalAmount: goal.goalAmount / 13 },
          { goalType: 'Daily', goalAmount: goal.goalAmount / 91 }
        );
      } else if (goal.goalType === 'Monthly') {
        smallerGoals.push(
          { goalType: 'Weekly', goalAmount: goal.goalAmount / 4 },
          { goalType: 'Daily', goalAmount: goal.goalAmount / 30 }
        );
      } else if (goal.goalType === 'Weekly') {
        smallerGoals.push(
          { goalType: 'Daily', goalAmount: goal.goalAmount / 7 }
        );
      } else if (goal.goalType === 'Daily') {
        // For Daily goals, no smaller division
        smallerGoals.push(goal);
      }
    });

    return smallerGoals;
  };

  // Fetch and process goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  // Process goals when they change
  useEffect(() => {
    if (goals.length > 0) {
      const dividedGoals = processGoals(goals);
      setProcessedGoals(dividedGoals);
    }
  }, [goals]);

  return (
    <div>
      {processedGoals.length > 0 ? (
        <div>
          <div className="goals-container">
            {goals.map((data, index) => (
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
