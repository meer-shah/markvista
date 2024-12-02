import React, { useState } from 'react';
import './setgoals.css';

function Setgoals() {
  const [selected, setSelected] = useState(null); // State to manage the selected radio button
  const [goalAmount, setGoalAmount] = useState(''); // State to manage the goal amount
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Function to handle the radio button change
  const handleChange = (e) => {
    setSelected(e.target.id); // Set the selected radio button by its id
  };

  // Function to handle goal amount input
  const handleGoalAmountChange = (e) => {
    setGoalAmount(e.target.value);
  };

  // Function to save the goal to the backend
  const saveGoal = async () => {
    if (!selected || !goalAmount) {
      alert('Please select a goal type and enter a goal amount.');
      return;
    }

    const goalData = {
      goalType: getGoalType(selected),
      goalAmount: parseFloat(goalAmount),
    };

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/goal/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error('Failed to save the goal. Please try again.');
      }

      alert('Goal successfully saved!');
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the goal type based on the selected radio button ID
  const getGoalType = (id) => {
    switch (id) {
      case 'radio1': return 'Daily';
      case 'radio2': return 'Weekly';
      case 'radio3': return 'Monthly';
      case 'radio4': return 'Quarterly';
      case 'radio5': return 'Yearly';
      default: return '';
    }
  };

  return (
    <div className="app__wrapper">
      <p>Choose goal type:</p>
      <div className="radio-button-container">
        {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((label, index) => (
          <div key={index} className="radio-button">
            <input
              type="radio"
              className="radio-button__input"
              id={`radio${index + 1}`}
              name="radio-group"
              checked={selected === `radio${index + 1}`}
              onChange={handleChange}
            />
            <label className="radio-button__label" htmlFor={`radio${index + 1}`}>
              <span className="radio-button__custom"></span>
              {label.toUpperCase()}
            </label>
          </div>
        ))}
      </div>

      <div className="form-group">
        <div className="label-tooltip">
          <p>Goal Amount</p>
          <span className="tooltip" data-tooltip="Specify your goal amount in dollars">?</span>
        </div>
        <input
          type="number"
          inputMode="decimal"
          pattern="[0-9]*[.]?[0-9]+"
          value={goalAmount}
          onChange={handleGoalAmountChange}
        />
      </div>

      <div className="button-group">
        <button className="form-button" onClick={saveGoal} disabled={loading}>
          {loading ? 'Saving...' : 'Set Goal'}
        </button>
      </div>
    </div>
  );
}

export default Setgoals;
