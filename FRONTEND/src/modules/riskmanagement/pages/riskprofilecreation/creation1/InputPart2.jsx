// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import './InputPart2.css';
// import Main from '../../visualizeandbreakdownpage/main';

// const InputPart2 = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   // State for input fields
//   const [initialRiskPerTrade, setInitialRiskPerTrade] = useState('');
//   const [growthThreshold, setGrowthThreshold] = useState('');
//   const [increaseOnWin, setIncreaseOnWin] = useState('');
//   const [decreaseOnLoss, setDecreaseOnLoss] = useState('');
//   const [SLallowedperday, setSLallowedperday] = useState('');
//   const [noofactivetrades, setNoofactivetrades] = useState('');
//   const [reset, setReset] = useState('');
//   const [maxRisk, setMaxRisk] = useState('');
//   const [minRisk, setMinRisk] = useState('');
//   const [payoutPercentage, setPayoutPercentage] = useState('');

//   useEffect(() => {
//     // Fetch the existing risk profile data for the given ID
//     if (id) {
//       const fetchRiskProfile = async () => {
//         try {
//           const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`);
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           const data = await response.json();
//           setInitialRiskPerTrade(data.initialRiskPerTrade || '');
//           setGrowthThreshold(data.growthThreshold || '');
//           setIncreaseOnWin(data.increaseOnWin || '');
//           setDecreaseOnLoss(data.decreaseOnLoss || '');
//           setSLallowedperday(data.SLallowedperday || '');
//           setNoofactivetrades(data.noofactivetrades || '');
//           setReset(data.reset || '');
//           setMaxRisk(data.maxRisk || '');
//           setMinRisk(data.minRisk || '');
//           setPayoutPercentage(data.payoutPercentage || '');
//         } catch (error) {
//           console.error('Error fetching risk profile:', error);
//         }
//       };

//       fetchRiskProfile();
//     }
//   }, [id]);

//   const applyDefaults = () => ({
//     initialRiskPerTrade: initialRiskPerTrade || 0,
//     growthThreshold: growthThreshold || 0,
//     increaseOnWin: increaseOnWin || 0,
//     decreaseOnLoss: decreaseOnLoss || 0,
//     SLallowedperday: SLallowedperday || 0,
//     noofactivetrades: noofactivetrades || 0,
//     reset: reset || 100000,
//     maxRisk: maxRisk || 100,
//     minRisk: minRisk || 0,
//     payoutPercentage: payoutPercentage || 0,
//   });

//   const validateInput = () => {
//     // Convert values to numbers
//     const numInitialRiskPerTrade = parseFloat(initialRiskPerTrade);
//     const numGrowthThreshold = parseFloat(growthThreshold);
//     const numIncreaseOnWin = parseFloat(increaseOnWin);
//     const numDecreaseOnLoss = parseFloat(decreaseOnLoss);
//     const numSLallowedperday = parseFloat(SLallowedperday);
//     const numNoofactivetrades = parseFloat(noofactivetrades);
//     const numReset = parseFloat(reset);
//     const numMaxRisk = parseFloat(maxRisk);
//     const numMinRisk = parseFloat(minRisk);
//     const numPayoutPercentage = parseFloat(payoutPercentage);

//     // Check validations
//     if (isNaN(numInitialRiskPerTrade) || numInitialRiskPerTrade <= 0) {
//       alert('Initial Risk Per Trade is mandatory and should be a positive number');
//       return false;
//     }
//     if (!isNaN(numNoofactivetrades) && numNoofactivetrades > numSLallowedperday) {
//       alert('No of Active Trades should be less than or equal to SL Allowed Per Day');
//       return false;
//     }
//     if (!isNaN(numSLallowedperday) && numSLallowedperday > 0 && isNaN(numNoofactivetrades)) {
//       alert('No of Active Trades cannot be null if SL Allowed Per Day is given');
//       return false;
//     }
//     if (!isNaN(numMaxRisk) && numMaxRisk < numInitialRiskPerTrade) {
//       alert('Max Risk should be greater than or equal to Initial Risk Per Trade');
//       return false;
//     }
//     if (!isNaN(numMinRisk) && numInitialRiskPerTrade < numMinRisk) {
//       alert('Initial Risk Per Trade should be greater than or equal to Min Risk');
//       return false;
//     }
//     if ((numPayoutPercentage > 0 && isNaN(numGrowthThreshold)) || 
//         (isNaN(numPayoutPercentage) && numGrowthThreshold > 0)) {
//       alert('Both Payout Percentage and Growth Threshold should be provided together');
//       return false;
//     }
//     if (numPayoutPercentage > 100) {
//       alert('Payout Percentage should not exceed 100%');
//       return false;
//     }

//     return true;
//   };

//   const handleSave = async () => {
//     if (!validateInput()) return;

//     const {
//       initialRiskPerTrade,
//       growthThreshold,
//       increaseOnWin,
//       decreaseOnLoss,
//       SLallowedperday,
//       noofactivetrades,
//       reset,
//       maxRisk,
//       minRisk,
//       payoutPercentage,
//     } = applyDefaults();

//     try {
//       if (id) {
//         const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             initialRiskPerTrade,
//             growthThreshold,
//             increaseOnWin,
//             decreaseOnLoss,
//             SLallowedperday,
//             noofactivetrades,
//             reset,
//             maxRisk,
//             minRisk,
//             payoutPercentage,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//       } else {
//         const riskProfileData = JSON.parse(localStorage.getItem('riskProfileData'));

//         const response = await fetch('http://localhost:4000/api/riskprofiles', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             title: riskProfileData.title,
//             description: riskProfileData.description,
//             initialRiskPerTrade,
//             growthThreshold,
//             increaseOnWin,
//             decreaseOnLoss,
//             SLallowedperday,
//             noofactivetrades,
//             reset,
//             maxRisk,
//             minRisk,
//             payoutPercentage,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         localStorage.removeItem('riskProfileData');
//       }

//       // Navigate to the Main component after saving
//       navigate(`/main/${id}`);
//     } catch (error) {
//       console.error('Error updating risk profile:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="app__wrapper">
//         <div className="form-container">
//           {/* First Main Div */}
//           <div className="main-div">
//             <div className="input-group">
//               {/* First Row of Inputs */}
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Initial Risk Per Trade</div>
//                   <span className="tooltip" data-tooltip="Specify the amount of risk you're willing to take per trade. This field is required.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input1"
//                   name="initialRiskPerTrade"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={initialRiskPerTrade}
//                   onChange={(e) => setInitialRiskPerTrade(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Payout Threshold</div>
//                   <span className="tooltip" data-tooltip="Specify the % percent of growth after which you will get a payout.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input2"
//                   name="growthThreshold"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={growthThreshold}
//                   onChange={(e) => setGrowthThreshold(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Increase on Win</div>
//                   <span className="tooltip" data-tooltip="Specify the percentage increase in risk after reaching a winning checkpoint.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input3"
//                   name="increaseOnWin"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={increaseOnWin}
//                   onChange={(e) => setIncreaseOnWin(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Decrease on Loss</div>
//                   <span className="tooltip" data-tooltip="Specify the percentage decrease in risk after a losing trade.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input4"
//                   name="decreaseOnLoss"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={decreaseOnLoss}
//                   onChange={(e) => setDecreaseOnLoss(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">SL Allowed Per Day</div>
//                   <span className="tooltip" data-tooltip="Specify the maximum number of stop loss hits allowed per day.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input5"
//                   name="SLallowedperday"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={SLallowedperday}
//                   onChange={(e) => setSLallowedperday(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Second Row of Inputs */}
//             <div className="input-group">
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">No Of Active Trades</div>
//                   <span className="tooltip" data-tooltip="Specify the maximum number of trades allowed to be open simultaneously.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input6"
//                   name="noofactivetrades"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={noofactivetrades}
//                   onChange={(e) => setNoofactivetrades(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Reset Point</div>
//                   <span className="tooltip" data-tooltip="Specify the amount of consecutive results after which you will get back to your initial risk percentage.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input7"
//                   name="reset"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={reset}
//                   onChange={(e) => setReset(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Max Risk</div>
//                   <span className="tooltip" data-tooltip="Specify the maximum risk percentage allowed per trade.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input8"
//                   name="maxRisk"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={maxRisk}
//                   onChange={(e) => setMaxRisk(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Min Risk</div>
//                   <span className="tooltip" data-tooltip="Specify the minimum risk percentage allowed per trade.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input9"
//                   name="minRisk"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={minRisk}
//                   onChange={(e) => setMinRisk(e.target.value)}
//                 />
//               </div>
//               <div className="form-group">
//                 <div className="label-tooltip">
//                   <div className="label">Payout Percentage</div>
//                   <span className="tooltip" data-tooltip="Specify the payout percentage for the trades.">?</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="input10"
//                   name="payoutPercentage"
//                   inputMode="decimal"
//                   pattern="[0-9]*[.]?[0-9]+"
//                   value={payoutPercentage}
//                   onChange={(e) => setPayoutPercentage(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Save and Visualize Buttons */}
//           <div className="button-group">
//             <button onClick={handleSave} className="form-button">Save</button>
//           </div>
//         </div>
//       </div>
//       <Main 
         
//         data={{
//           initialRiskPerTrade,
//           growthThreshold,
//           increaseOnWin,
//           decreaseOnLoss,
//           SLallowedperday,
//           noofactivetrades,
//           reset,
//           maxRisk,
//           minRisk,
//           payoutPercentage
//         }} 
//       />
//     </div>
//   );
// };

// export default InputPart2;

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
  const [noofactivetrades, setNoofactivetrades] = useState('');
  const [reset, setReset] = useState('');
  const [maxRisk, setMaxRisk] = useState('');
  const [minRisk, setMinRisk] = useState('');
  const [payoutPercentage, setPayoutPercentage] = useState('');

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
          setNoofactivetrades(data.noofactivetrades || '');
          setReset(data.reset || '');
          setMaxRisk(data.maxRisk || '');
          setMinRisk(data.minRisk || '');
          setPayoutPercentage(data.payoutPercentage || '');
        } catch (error) {
          console.error('Error fetching risk profile:', error);
        }
      };

      fetchRiskProfile();
    }
  }, [id]);

  const applyDefaults = () => {
    return {
      initialRiskPerTrade: initialRiskPerTrade || 0,
      growthThreshold: growthThreshold || 0,
      increaseOnWin: increaseOnWin || 0,
      decreaseOnLoss: decreaseOnLoss || 0,
      SLallowedperday: SLallowedperday || 0,
      noofactivetrades: noofactivetrades || 0,
      reset: reset || 100000,
      maxRisk: maxRisk || 100,
      minRisk: minRisk || 0,
      payoutPercentage: payoutPercentage || 0,
    };
  };

  const validateInput = () => {
    
  
    // Convert values to numbers
    const numInitialRiskPerTrade = parseFloat(initialRiskPerTrade);
    const numGrowthThreshold = parseFloat(growthThreshold);
    const numIncreaseOnWin = parseFloat(increaseOnWin);
    const numDecreaseOnLoss = parseFloat(decreaseOnLoss);
    const numSLallowedperday = parseFloat(SLallowedperday);
    const numNoofactivetrades = parseFloat(noofactivetrades);
    const numReset = parseFloat(reset);
    const numMaxRisk = parseFloat(maxRisk);
    const numMinRisk = parseFloat(minRisk);
    const numPayoutPercentage = parseFloat(payoutPercentage);
  
    // Check if Initial Risk Per Trade is provided
    if (isNaN(numInitialRiskPerTrade) || numInitialRiskPerTrade <= 0) {
      alert('Initial Risk Per Trade is mandatory and should be a positive number');
      return false;
    }
  
    // Check if No of Active Trades is less than or equal to SL Allowed Per Day
    if (!isNaN(numNoofactivetrades) && numNoofactivetrades > numSLallowedperday) {
      alert('No of Active Trades should be less than or equal to SL Allowed Per Day');
      return false;
    }
  
    // Check if SL Allowed Per Day is provided and No of Active Trades is missing
    if (!isNaN(numSLallowedperday) && numSLallowedperday > 0 && isNaN(numNoofactivetrades)) {
      alert('No of Active Trades cannot be null if SL Allowed Per Day is given');
      return false;
    }
  
    // Check if Max Risk is greater than or equal to Initial Risk Per Trade
    if (!isNaN(numMaxRisk) && numMaxRisk < numInitialRiskPerTrade) {
      alert('Max Risk should be greater than or equal to Initial Risk Per Trade');
      return false;
    }
  
    // Check if Initial Risk Per Trade is greater than or equal to Min Risk
    if (!isNaN(numMinRisk) && numInitialRiskPerTrade < numMinRisk) {
      alert('Initial Risk Per Trade should be greater than or equal to Min Risk');
      return false;
    }
  
    // Check if both Payout Percentage and Growth Threshold are provided
    if ((numPayoutPercentage > 0 && isNaN(numGrowthThreshold)) || 
        (isNaN(numPayoutPercentage) && numGrowthThreshold > 0)) {
      alert('Both Payout Percentage and Growth Threshold should be provided together');
      return false;
    }
  
    // Check if Payout Percentage exceeds 100
    if (numPayoutPercentage > 100) {
      alert('Payout Percentage should not exceed 100%');
      return false;
    }
  
    return true;
  };
  

  const handleSave = async () => {
    if (!validateInput()) return;

    const {
      initialRiskPerTrade,
      growthThreshold,
      increaseOnWin,
      decreaseOnLoss,
      SLallowedperday,
      noofactivetrades,
      reset,
      maxRisk,
      minRisk,
      payoutPercentage,
    } = applyDefaults();

    try {
      if (id) {
        const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`, {
          method: 'PATCH', // Use PATCH for partial updates
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialRiskPerTrade,
            growthThreshold,
            increaseOnWin,
            decreaseOnLoss,
            SLallowedperday,
            noofactivetrades,
            reset,
            maxRisk,
            minRisk,
            payoutPercentage,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } else {
        // Fetch name and description from local storage
        const riskProfileData = JSON.parse(localStorage.getItem('riskProfileData'));

        const response = await fetch('http://localhost:4000/api/riskprofiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: riskProfileData.title,
            description: riskProfileData.description,
            initialRiskPerTrade,
            growthThreshold,
            increaseOnWin,
            decreaseOnLoss,
            SLallowedperday,
            noofactivetrades,
            reset,
            maxRisk,
            minRisk,
            payoutPercentage,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Clear local storage if necessary
        localStorage.removeItem('riskProfileData');
      }
    } catch (error) {
      console.error('Error updating risk profile:', error);
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
                <div className="label">Payout Threshold</div>
                <span className="tooltip" data-tooltip="Specify the % percent of growth after which you will get a payout.">?</span>
              </div>
              <input
                type="number"
                id="input2"
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
                id="input3"
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
                id="input4"
                name="decreaseOnLoss"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={decreaseOnLoss}
                onChange={(e) => setDecreaseOnLoss(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">SL Allowed Per Day</div>
                <span className="tooltip" data-tooltip="Specify the maximum number of stop loss hits allowed per day.">?</span>
              </div>
              <input
                type="number"
                id="input5"
                name="SLallowedperday"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={SLallowedperday}
                onChange={(e) => setSLallowedperday(e.target.value)}
              />
            </div>
          </div>

          {/* Second Row of Inputs */}
          <div className="input-group">
            <div className="form-group">
              <div className="label-tooltip">
                <div className="label">No Of Active Trades</div>
                <span className="tooltip" data-tooltip="Specify the maximum number of trades allowed to be open simultaneously.">?</span>
              </div>
              <input
                type="number"
                id="input6"
                name="noofactivetrades"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]+"
                value={noofactivetrades}
                onChange={(e) => setNoofactivetrades(e.target.value)}
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
          </div>
        </div>
        {/* Save and Visualize Buttons */}
        <div className="button-group">
          <button onClick={handleSave} className="form-button">Save</button>
          
        </div>
      </div>
    </div>
  );
};

export default Inputpart2;
