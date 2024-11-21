import React, { useState, useEffect } from 'react';
import './breakdown.css';
import { generateData } from '../../../constants/index';

const Breakdown = ({ id, setData, setIsStrategyRun }) => {
  const [winRate, setWinRate] = useState('');
  const [riskRewardRatio, setRiskRewardRatio] = useState('');
  const [accountSize, setAccountSize] = useState('');
  const [numTrades, setNumTrades] = useState('');
  const [riskProfile, setRiskProfile] = useState(null);
  const [breakdownResults, setBreakdownResults] = useState({
    winRate: 0,
    trades: 0,
    wins: 0,
    losses: 0,
    usdWon: 0,
    usdLost: 0,
    netProfitLoss: 0,
  });
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    const fetchRiskProfile = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/riskprofiles/${id}`);
        const data = await response.json();
        setRiskProfile(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRiskProfile();
  }, [id]);

  const handleRunStrategy = () => {
    if (!riskProfile) return;

    const parsedWinRate = parseFloat(winRate) || 0;
    const parsedRiskRewardRatio = parseFloat(riskRewardRatio) || 0;
    const parsedAccountSize = parseFloat(accountSize) || 0;
    const parsedNumTrades = parseFloat(numTrades) || 0;

    // Check if the riskRewardRatio is less than the minimum defined in the risk profile
    if (parsedRiskRewardRatio < riskProfile.minRiskRewardRatio) {
      alert(`Risk to Reward Ratio cannot be less than ${riskProfile.minRiskRewardRatio}`);
      return; // Exit the function if the condition is met
    }

    // setError(''); // Clear error if validation passes

    const data = generateData(
      parsedNumTrades,
      parsedWinRate / 100,
      parsedRiskRewardRatio,
      parsedAccountSize,
      riskProfile.initialRiskPerTrade,
      riskProfile.increaseOnWin,
      riskProfile.decreaseOnLoss,
      riskProfile.maxRisk,
      riskProfile.minRisk,
      riskProfile.reset,
      riskProfile.growthThreshold,
      riskProfile.payoutPercentage,
      riskProfile.SLallowedperday
    );

    const wins = data.filter(trade => trade.Outcome === 'Win').length;
    const losses = data.length - wins;
    const usdWon = data.reduce((acc, trade) => acc + (trade.PNL > 0 ? parseFloat(trade.PNL) : 0), 0);
    const usdLost = data.reduce((acc, trade) => acc + (trade.PNL < 0 ? parseFloat(trade.PNL) : 0), 0);
    const netProfitLoss = usdWon + usdLost;

    setBreakdownResults({
      winRate: (wins / data.length) * 100,
      trades: data.length,
      wins: wins,
      losses: losses,
      usdWon: usdWon,
      usdLost: usdLost,
      netProfitLoss: netProfitLoss,
    });

    setData(data);
    setIsStrategyRun(true); // Set strategy as run
  };

  return (
    <div className="breakdown__app__wrapper">
      <div className="breakdown__main-div">
        {/* First Main Div */}
        <div className="breakdown__first-main-div">
          <p className='small__heading'>{riskProfile ? riskProfile.title : 'Loading...'}</p>
          <div className="breakdown__form-group">
            <div className="breakdown__label-tooltip">
              <label>Winrate</label>
              <span className="breakdown__tooltip" data-tooltip="Percentage of winning trades">?</span>
            </div>
            <input 
              type="number" 
              value={winRate} 
              onChange={(e) => setWinRate(e.target.value)} 
              step="0.01" // Allow decimal values
            />
          </div>
          <div className="breakdown__form-group">
            <div className="breakdown__label-tooltip">
              <label>Risk to Reward Ratio</label>
              <span className="breakdown__tooltip" data-tooltip="Risk to reward ratio for trades">?</span>
            </div>
            <input 
              type="number" 
              value={riskRewardRatio} 
              onChange={(e) => setRiskRewardRatio(e.target.value)} 
              step="0.01" // Allow decimal values
            />
          </div>
          <div className="breakdown__form-group">
            <div className="breakdown__label-tooltip">
              <label>Account Size</label>
              <span className="breakdown__tooltip" data-tooltip="Size of the trading account">?</span>
            </div>
            <input 
              type="number" 
              value={accountSize} 
              onChange={(e) => setAccountSize(e.target.value)} 
              step="0.01" // Allow decimal values
            />
          </div>
          <div className="breakdown__form-group">
            <div className="breakdown__label-tooltip">
              <label>No of Trades</label>
              <span className="breakdown__tooltip" data-tooltip="Total number of trades">?</span>
            </div>
            <input 
              type="number" 
              value={numTrades} 
              onChange={(e) => setNumTrades(e.target.value)} 
              step="1" // Whole numbers only
            />
          </div>
          <button className="form-button" onClick={handleRunStrategy}>Run Strategy</button>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </div>

        {/* Second Main Div */}
        <div className="breakdown__second-main-div">
          <p className='p__heading'>Breakdown</p>
          <div className="breakdown__info">
            <p>Win Rate: <span>{breakdownResults.winRate.toFixed(2)}%</span></p>
            <p>Trades: <span>{breakdownResults.trades}</span></p>
            <p>Wins: <span>{breakdownResults.wins}</span></p>
            <p>Losses: <span>{breakdownResults.losses}</span></p>
            <p>USD Won: <span>${breakdownResults.usdWon.toFixed(2)}</span></p>
            <p>USD Lost: <span>${breakdownResults.usdLost.toFixed(2)}</span></p>
            <p>Net Profit/Loss: <span>${breakdownResults.netProfitLoss.toFixed(2)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Breakdown;
