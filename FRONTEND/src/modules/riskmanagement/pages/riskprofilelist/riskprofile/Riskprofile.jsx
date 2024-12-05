
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

  const [activeProfileId, setActiveProfileId] = useState(null);

  const handleToggle = async (id) => {
    const newActiveId = activeProfileId === id ? null : id;
  
    try {
      const payload = { ison: newActiveId !== null }; // Set 'ison' to true or false based on toggle
  
      // Make the PUT request to activate/deactivate the risk profile
      const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}/activate`, {
        method: 'PUT', // Change to PUT for the activate endpoint
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to activate/deactivate risk profile');
      }
  
      setActiveProfileId(newActiveId);
    } catch (error) {
      console.error('Error toggling risk profile:', error);
    }
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
            isChecked={activeProfileId === riskProfile._id} // Pass checked state
          onToggle={() => handleToggle(riskProfile._id)}  // Pass toggle handler
          defaultProfile={riskProfile.default}
          />
        ))}
      </div>
      <div className='container'>
        <button type="button" className="form-button" onClick={handleAddClick}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Riskprofile;   