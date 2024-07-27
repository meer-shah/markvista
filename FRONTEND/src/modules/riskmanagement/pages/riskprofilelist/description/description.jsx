import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './description.css'; // Ensure you have a CSS file for styling
import { stringify } from 'flatted'

const Description = () => {
  const { id } = useParams(); // Get the risk profile ID from the URL
  const [riskProfile, setRiskProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskProfile = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRiskProfile(data);
      } catch (error) {
        console.error('Error fetching risk profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskProfile();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!riskProfile) {
    return <div>No risk profile found</div>;
  }

  return (
    <div className={'app__wrapper main'}>
      <p className='small__heading'>{riskProfile.title}</p>
      <p className={'app__wrapper_info p__basic'}>{riskProfile.description || 'No description available'}
      <ul className={'risk-profile-details  p__basic'}>
        <li><strong>Initial Risk Per Trade:</strong> {riskProfile.initialRiskPerTrade}</li>
        <li><strong>SL Allowed Per Day:</strong> {riskProfile.SLallowedperday}</li>
        <li><strong>Increase on Win:</strong> {riskProfile.increaseOnWin}</li>
        <li><strong>Decrease on Loss:</strong> {riskProfile.decreaseOnLoss}</li>
        <li><strong>Max Risk:</strong> {riskProfile.maxRisk}</li>
        <li><strong>Min Risk:</strong> {riskProfile.minRisk}</li>
        <li><strong>Reset:</strong> {riskProfile.reset}</li>
        <li><strong>Growth Threshold:</strong> {riskProfile.growthThreshold}</li>
        <li><strong>Payout Percentage:</strong> {riskProfile.payoutPercentage}</li>
        <li><strong>Number of Active Trades:</strong> {riskProfile.noofactivetrades}</li>
        <li><strong>Created At:</strong> {new Date(riskProfile.createdAt).toLocaleDateString()}</li>
      </ul>
      </p>
    </div>
  );
};

export default Description;
