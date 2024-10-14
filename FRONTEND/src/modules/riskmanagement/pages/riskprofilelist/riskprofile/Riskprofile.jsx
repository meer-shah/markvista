
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import{ RiskprofileTemplate }  from '../../../containers'; // Adjust the import path if needed
import './Riskprofile.css';

const Riskprofile = () => {
  const navigate = useNavigate();
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskProfiles = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/riskprofiles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRiskProfiles(data);
      } catch (error) {
        console.error('Error fetching risk profiles:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskProfiles();
  }, []);

  const handleAddClick = () => {
    navigate('/Inputpart1');
  };

  const handleDelete = (id) => {
    setRiskProfiles((prevProfiles) => prevProfiles.filter(profile => profile._id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='section__padding' style={{ backgroundColor: 'var(--color-background)' }} id="riskprofile">
      <div>
        <p className='p__heading'>Risk Profiles</p>
      </div>
      {/* <div className="radio-inputs">
        <label className="radio">
          <input type="radio" name="radio" defaultChecked />
          <span className="name">ALL</span>
        </label>
        <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">CUSTOM</span>
        </label>
        <label className="radio">
          <input type="radio" name="radio" />
          <span className="name">DEFAULT</span>
        </label>
      </div> */}
      <div id='riskprofile'>
        {riskProfiles.map((riskProfile) => (
          <RiskprofileTemplate
            key={riskProfile._id}
            id={riskProfile._id}
            title={riskProfile.title}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className='container'>
        <button type="button" className="custom-button" onClick={handleAddClick}>
          <span className="custom-button__text , p__basic">Add</span>
          <span className="custom-button__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="currentColor"
              height="24"
              fill="none"
              className="custom-svg"
            >
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Riskprofile;
