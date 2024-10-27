
import React from 'react';
import   useNavigate  from 'react-router-dom';
import './apiconnection.css';

const APICONNECTION = () => {
 





  return (
    <div className='app__wrapper'>
      <div className="form-container">
        <form className="form" >
          <div className="form-group">
            <label htmlFor="title">API-KEY</label>
            <input
              type="text"
              id="API-KEY"
              name="API-KEY"
             
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">SECRET-KEY</label>
            <textarea
              id="SECRET-KEY"
              name="SECRET-KEY"
              
              cols="50"
              rows="3"
              required
            ></textarea>
          </div>
          {/* Add other form fields similarly */}
          <button type="submit" className="form-submit-btn">CONNECT</button>
        </form>
      </div>
    </div>
  );
};

export default APICONNECTION;
