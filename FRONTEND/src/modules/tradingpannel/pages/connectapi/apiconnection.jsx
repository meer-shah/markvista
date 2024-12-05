import React, { useState } from 'react';
import axios from 'axios'; // For API requests
import './apiconnection.css';

const APICONNECTION = () => {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState(''); // To display feedback to the user

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/connection/api-connection', {
        apiKey,
        secretKey,
      });
      setMessage(response.data.message); // Show success message from backend
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="app__wrapper">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="API-KEY">API-KEY</label>
            <input
              type="text"
              id="API-KEY"
              name="API-KEY"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)} // Update state
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="SECRET-KEY">SECRET-KEY</label>
            <textarea
              id="SECRET-KEY"
              name="SECRET-KEY"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)} // Update state
              cols="50"
              rows="3"
              required
            ></textarea>
          </div>
          <button type="submit" className="form-submit-btn">CONNECT</button>
        </form>
        {message && <p className="message">{message}</p>} {/* Feedback message */}
      </div>
    </div>
  );
};

export default APICONNECTION;
