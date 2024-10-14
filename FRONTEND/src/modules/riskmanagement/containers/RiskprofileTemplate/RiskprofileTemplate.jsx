
import React from 'react';
import './RiskprofileTemplate.css';
import edit from '../../../../assets/edit.png';
import Delete from '../../../../assets/delete.png';
import see from '../../../../assets/see.png';
import description from '../../../../assets/paper.png';
import { useNavigate } from 'react-router-dom';

const RiskprofileTemplate = ({ id, title, onDelete }) => {
  const navigate = useNavigate();

  const navigateToDescription = () => {
    navigate(`/description/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Call onDelete to update the parent component state
      onDelete(id);
    } catch (error) {
      console.error('Error deleting risk profile:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit1/${id}`);
  };

  const navigateToMain = () => {
    navigate(`/main/${id}`);
  };

  return (
    <div className='app_rp'>
      <div className='name'>{title}</div>

      <div className='button'>
        <label className="switch">
          <input id="toggleButton" type="checkbox" />
          <div className="slider">
            <div className="circle">
              <svg
                className="cross"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 365.696 365.696"
                xmlSpace="preserve"
                height="6"
                width="6"
                style={{ enableBackground: 'new 0 0 512 512' }}
              >
                <g>
                  <path
                    fill="currentColor"
                    d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                  ></path>
                </g>
              </svg>
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                xmlSpace="preserve"
                height="10"
                width="10"
                style={{ enableBackground: 'new 0 0 512 512' }}
              >
                <g>
                  <path
                    fill="currentColor"
                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
        </label>
      </div>

      <div className='app_rp-inner'>
        <div className='inner-item' onClick={handleEdit}><img src={edit} alt="Edit Icon" /></div>

        <div className='inner-item' onClick={() => navigateToDescription(id)}>
          <img src={description} alt="Description Icon" />
        </div>

        <div className='inner-item' onClick={navigateToMain}><img src={see} alt="See Icon" /></div>
        
        <div className='inner-item' onClick={handleDelete}>
          <img src={Delete} alt="Delete Icon" />
        </div>
      </div>
    </div>
  );
};

export default RiskprofileTemplate;
