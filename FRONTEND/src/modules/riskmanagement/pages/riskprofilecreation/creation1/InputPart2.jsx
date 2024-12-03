

import React, { useState, useEffect } from 'react';
import './InputPart2.css';
import { useNavigate, useParams } from 'react-router-dom';
import Main from '../../visualizeandbreakdownpage/main'

const Inputpart2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  

  // State for input fields
  const [initialRiskPerTrade, setInitialRiskPerTrade] = useState('');
  const [growthThreshold, setGrowthThreshold] = useState('');
  const [increaseOnWin, setIncreaseOnWin] = useState('');
  const [decreaseOnLoss, setDecreaseOnLoss] = useState('');
  const [SLallowedperday, setSLallowedperday] = useState('');
  const [reset, setReset] = useState('');
  const [maxRisk, setMaxRisk] = useState('');
  const [minRisk, setMinRisk] = useState('');
  const [payoutPercentage, setPayoutPercentage] = useState('');
  const [minRiskRewardRatio, setMinRiskRewardRatio] = useState('');
  const [isDefault, setIsDefault] = useState(false); // State for default checkbox

  useEffect(() => {
    // Fetch the existing risk profile data for the given ID
    if (id) {
      const fetchRiskProfile = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setInitialRiskPerTrade(data.initialRiskPerTrade || '');
          setGrowthThreshold(data.growthThreshold || '');
          setIncreaseOnWin(data.increaseOnWin || '');
          setDecreaseOnLoss(data.decreaseOnLoss || '');
          setSLallowedperday(data.SLallowedperday || '');
          setReset(data.reset || '');
          setMaxRisk(data.maxRisk || '');
          setMinRisk(data.minRisk || '');
          setPayoutPercentage(data.payoutPercentage || '');
          setMinRiskRewardRatio(data.minRiskRewardRatio || '');
          setIsDefault(data.default || false); // Pre-fill the checkbox
        } catch (error) {
          console.error('Error fetching risk profile:', error);
        }
      };

      fetchRiskProfile();
    }
  }, [id]);

  const handleSave = async () => {
    const profileData = {
      initialRiskPerTrade,
      growthThreshold,
      increaseOnWin,
      decreaseOnLoss,
      SLallowedperday,
      reset,
      maxRisk,
      minRisk,
      payoutPercentage,
      minRiskRewardRatio,
      default: isDefault, // Include the default field
    };

    try {
      if (id) {
        const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          throw new Error('Failed to update the risk profile');
        }
      } else {
        const riskProfileData = JSON.parse(localStorage.getItem('riskProfileData'));

        const response = await fetch('http://localhost:4000/api/riskprofiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...profileData,
            title: riskProfileData.title,
            description: riskProfileData.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create the risk profile');
        }

        localStorage.removeItem('riskProfileData');
      }

      // Ensure only one profile is default
      if (isDefault) {
        await fetch('http://localhost:4000/api/riskprofiles/reset-default', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }), // Pass current profile ID
        });
      }

      console.log("set as default") // Redirect after save
    } catch (error) {
      console.error('Error saving risk profile:', error);
    }
  };
  


  return (
    <div className="app__wrapper">
      <div className="form-container">
        {/* First Main Div */}
        <div className="main-div">
          <div className="input-group">
            {/* First Row of Inputs */}
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Initial Risk Per Trade</div>
                <span className="tooltip" data-tooltip="Specify the amount of risk you're willing to take per trade. This field is required.">?</span>
              </div>
              <input
                type="number"
                id="input1"
                name="initialRiskPerTrade"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={initialRiskPerTrade}
                onChange={(e) => setInitialRiskPerTrade(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Minimum Risk to Reward Ratio</div>
                <span className="tooltip" data-tooltip="Specify the minimum acceptable risk to reward ratio for trades.">?</span>
              </div>
              <input
                type="number"
                id="input2"
                name="minRiskRewardRatio"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={minRiskRewardRatio}
                onChange={(e) => setMinRiskRewardRatio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Payout Threshold</div>
                <span className="tooltip" data-tooltip="Specify the % percent of growth after which you will get a payout.">?</span>
              </div>
              <input
                type="number"
                id="input3"
                name="growthThreshold"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={growthThreshold}
                onChange={(e) => setGrowthThreshold(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Increase on Win</div>
                <span className="tooltip" data-tooltip="Specify the percentage increase in risk after reaching a winning checkpoint.">?</span>
              </div>
              <input
                type="number"
                id="input4"
                name="increaseOnWin"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={increaseOnWin}
                onChange={(e) => setIncreaseOnWin(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Decrease on Loss</div>
                <span className="tooltip" data-tooltip="Specify the percentage decrease in risk after a losing trade.">?</span>
              </div>
              <input
                type="number"
                id="input5"
                name="decreaseOnLoss"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={decreaseOnLoss}
                onChange={(e) => setDecreaseOnLoss(e.target.value)}
              />
            </div>
            <label>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <div className="label">Set as Default</div>
            </label>
          </div>

          {/* Second Row of Inputs */}
          <div className="input-group">
          <div className="form-group">
              <div className="label-tooltip">
                <div className="label">SL Allowed Per Day</div>
                <span className="tooltip" data-tooltip="Specify the maximum number of stop loss hits allowed per day.">?</span>
              </div>
              <input
                type="number"
                id="input6"
                name="SLallowedperday"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={SLallowedperday}
                onChange={(e) => setSLallowedperday(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Reset Point</div>
                <span className="tooltip" data-tooltip="Specify the amount of consecutive results after which you will get back to your initial risk percentage.">?</span>
              </div>
              <input
                type="number"
                id="input7"
                name="reset"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={reset}
                onChange={(e) => setReset(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Max Risk</div>
                <span className="tooltip" data-tooltip="Specify the maximum risk percentage allowed per trade.">?</span>
              </div>
              <input
                type="number"
                id="input8"
                name="maxRisk"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={maxRisk}
                onChange={(e) => setMaxRisk(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Min Risk</div>
                <span className="tooltip" data-tooltip="Specify the minimum risk percentage allowed per trade.">?</span>
              </div>
              <input
                type="number"
                id="input9"
                name="minRisk"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={minRisk}
                onChange={(e) => setMinRisk(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">Payout Percentage</div>
                <span className="tooltip" data-tooltip="Specify the payout percentage for the trades.">?</span>
              </div>
              <input
                type="number"
                id="input10"
                name="payoutPercentage"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={payoutPercentage}
                onChange={(e) => setPayoutPercentage(e.target.value)}
              />
            </div>
            <div className="button-group">
              {/* Checkbox for setting default */}
          <div className="form-group">
          
          </div>
          <button onClick={handleSave} className="form-button">Save</button>
          
        </div>
          </div>
          
        </div>
        {/* Save and Visualize Buttons */}
        
      </div>
    </div>
  );
};

export default Inputpart2;

