import React, { useState } from 'react';
import './setgoals.css';

function Setgoals() {
  const [selected, setSelected] = useState(null); // State to manage the selected radio button

  // Function to handle the change event
  const handleChange = (e) => {
    setSelected(e.target.id); // Set the selected radio button by its id
  };

  return (
    <div className='app__wrapper'>
<p> Choose goal type:</p>

      <div className="radio-button-container ">
        <div className="radio-button">
          <input
            type="radio"
            className="radio-button__input"
            id="radio1"
            name="radio-group"
            checked={selected === 'radio1'} // Check if this radio is selected
            onChange={handleChange} // Handle the change event
          />
          <label className="radio-button__label" htmlFor="radio1">
            <span className="radio-button__custom"></span>
            DAILY
          </label>
        </div>

        <div className="radio-button">
          <input
            type="radio"
            className="radio-button__input"
            id="radio2"
            name="radio-group"
            checked={selected === 'radio2'} // Check if this radio is selected
            onChange={handleChange} // Handle the change event
          />
          <label className="radio-button__label" htmlFor="radio2">
            <span className="radio-button__custom"></span>
            WEEKLY
          </label>
        </div>

        <div className="radio-button">
          <input
            type="radio"
            className="radio-button__input"
            id="radio3"
            name="radio-group"
            checked={selected === 'radio3'} // Check if this radio is selected
            onChange={handleChange} // Handle the change event
          />
          <label className="radio-button__label" htmlFor="radio3">
            <span className="radio-button__custom"></span>
            MONTHLY
          </label>
        </div>

        <div className="radio-button">
          <input
            type="radio"
            className="radio-button__input"
            id="radio4"
            name="radio-group"
            checked={selected === 'radio4'} // Check if this radio is selected
            onChange={handleChange} // Handle the change event
          />
          <label className="radio-button__label" htmlFor="radio4">
            <span className="radio-button__custom"></span>
            QUATERLY
          </label>
        </div>

        <div className="radio-button">
          <input
            type="radio"
            className="radio-button__input"
            id="radio5"
            name="radio-group"
            checked={selected === 'radio5'} // Check if this radio is selected
            onChange={handleChange} // Handle the change event
          />
          <label className="radio-button__label" htmlFor="radio5">
            <span className="radio-button__custom"></span>
            YEARLY
          </label>
        </div>
      </div>

      <div className="form-group">
              <div className="label-tooltip">
                <p>

                Goal Ammount
                </p>
               
                <span className="tooltip" data-tooltip="Specify  your goal ammount in dollars">?</span>
              </div>
              <input
                type="number"
                
               
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                    />
            </div>
      <div className="button-group">
          <button  className="form-button">Set Goal</button>
          
        </div>

    </div>
  );
}

export default Setgoals;
